import { createContext, useState, useRef, useCallback, type ReactNode } from 'react';
import type { GroupInterface, AthleteInGroup } from '../interface/GroupInterface';
import { defaultAdminContext, type AdminContextInterface } from './AdminContextType';
import axios from 'axios';

export const AdminContext = createContext<AdminContextInterface>(defaultAdminContext);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupInterface[] | undefined>(undefined);
  const [adminError, setAdminError] = useState<string>('');

  // Ref espelha o state de groups para evitar problema de closure nas funções
  const groupsRef = useRef<GroupInterface[] | undefined>(undefined);
  const inflightRequest = useRef<Promise<GroupInterface[]> | null>(null);

  const baseURL = import.meta.env.VITE_MSS_API_URL;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const setGroupsSync = (data: GroupInterface[] | undefined) => {
    groupsRef.current = data;
    setGroups(data);
  };

  // force=true ignora o cache e busca da API novamente
  const get_all_groups = useCallback(async (force = false): Promise<GroupInterface[]> => {
    // Usa a ref para ler o valor atual sem depender do closure
    if (!force && groupsRef.current !== undefined) return groupsRef.current;
    if (!force && inflightRequest.current) return inflightRequest.current;

    inflightRequest.current = axios
      .get(`${baseURL}/get-all-groups`, { headers: getAuthHeaders() })
      .then((response) => {
        const data: GroupInterface[] = response.data.groups ?? response.data;
        setGroupsSync(data);
        return data;
      })
      .catch((error: any) => {
        const errorMsg = error.response?.data?.message ?? error.message;
        setAdminError(errorMsg);
        throw error;
      })
      .finally(() => {
        inflightRequest.current = null;
      });

    return inflightRequest.current;
  }, [baseURL]);

  const update_group = useCallback(async (
    group_id: string,
    athletes_list: AthleteInGroup[],
    supporter_list: AthleteInGroup[]
  ): Promise<void> => {
    try {
      const payload: any = { group_id };

      if (athletes_list.length > 0) {
        payload.new_athlete_list_id = athletes_list.map((a) => a.user_id);
      }

      if (supporter_list.length > 0) {
        payload.new_supporter_list_id = supporter_list.map((s) => s.user_id);
      }

      await axios.put(
        `${baseURL}/update-group`,
        payload,
        { headers: getAuthHeaders() }
      );

      // Força refetch para garantir consistência
      await get_all_groups(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      throw error;
    }
  }, [baseURL, get_all_groups]);

  const delete_group = useCallback(async (group_id: string): Promise<void> => {
    try {
      await axios.delete(`${baseURL}/delete-group`, {
        headers: getAuthHeaders(),
        data: { group_id },
      });

      // Atualiza local imediatamente para UI responsiva, depois força refetch
      setGroupsSync(groupsRef.current?.filter((g) => g.group_id !== group_id));
      await get_all_groups(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      throw error;
    }
  }, [baseURL, get_all_groups]);

  function handleLogout() {
    setGroupsSync(undefined);
    setAdminError('');
    inflightRequest.current = null;
  }

  const value: AdminContextInterface = {
    get_all_groups,
    update_group,
    delete_group,
    handleLogout,
    groups,
    adminError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};