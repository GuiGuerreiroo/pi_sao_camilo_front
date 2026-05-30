import { createContext, useState, type ReactNode } from 'react';
import type { GroupInterface, AthleteInGroup } from '../interface/GroupInterface';
import { defaultAdminContext, type AdminContextInterface } from './AdminContextType';
import axios from 'axios';

export const AdminContext = createContext<AdminContextInterface>(defaultAdminContext);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupInterface[] | undefined>(undefined);
  const [adminError, setAdminError] = useState<string>('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const baseURL = import.meta.env.VITE_MSS_API_URL;

  async function get_all_groups() {
    if (groups !== undefined) return groups;
    try {
      const response = await axios.get(
        `${baseURL}/get-all-groups`,
        { headers: getAuthHeaders() }
      );

      const data = response.data.groups || response.data;
      setGroups(data);
      return data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  async function update_group(group_id: string, athletes_list: AthleteInGroup[]) {
    try {
      const response = await axios.put(
        `${baseURL}/update-group`,
        { group_id, athletes_list },
        { headers: getAuthHeaders() }
      );

      const updatedGroup: GroupInterface = response.data.group || { group_id, athletes_list };

      setGroups(prev =>
        prev?.map(g => g.group_id === group_id ? updatedGroup : g)
      );
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  async function delete_group(group_id: string) {
    try {
      await axios.delete(
        `${baseURL}/delete-group`,
        {
          headers: getAuthHeaders(),
          data: { group_id },
        }
      );

      setGroups(prev => prev?.filter(g => g.group_id !== group_id));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  const handleLogout = () => {
    setGroups(undefined);
    setAdminError('');
  };

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