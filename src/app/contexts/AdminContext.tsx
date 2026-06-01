import { createContext, useState, useRef, type ReactNode } from 'react';
import type { GroupInterface, AthleteInGroup } from '../interface/GroupInterface';
import { defaultAdminContext, type AdminContextInterface } from './AdminContextType';
import axios from 'axios';

export const AdminContext = createContext<AdminContextInterface>(defaultAdminContext);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupInterface[] | undefined>(undefined);
  const [adminError, setAdminError] = useState<string>('');

  const inflightRequest = useRef<Promise<GroupInterface[]> | null>(null);

  const baseURL = import.meta.env.VITE_MSS_API_URL;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  async function get_all_groups(): Promise<GroupInterface[]> {
    if (groups !== undefined) return groups;
    if (inflightRequest.current) return inflightRequest.current;

    inflightRequest.current = axios
      .get(`${baseURL}/get-all-groups`, { headers: getAuthHeaders() })
      .then((response) => {
        const data: GroupInterface[] = response.data.groups ?? response.data;
        setGroups(data);
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
  }

  async function update_group(
    group_id: string,
    athletes_list: AthleteInGroup[],
    supporter_list: AthleteInGroup[]
  ): Promise<void> {
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

      setGroups((prev) =>
        prev?.map((g) =>
          g.group_id === group_id
            ? { group_id, athletes_list, supporter_list }
            : g
        )
      );
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      throw error;
    }
  }

  async function delete_group(group_id: string): Promise<void> {
    try {
      await axios.delete(`${baseURL}/delete-group`, {
        headers: getAuthHeaders(),
        data: { group_id },
      });

      setGroups((prev) => prev?.filter((g) => g.group_id !== group_id));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      throw error;
    }
  }

  function handleLogout() {
    setGroups(undefined);
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