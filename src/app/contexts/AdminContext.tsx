import { createContext, useState, type ReactNode } from 'react';
import type { GroupInterface, AthleteInGroup } from '../interface/GroupInterface';
import { defaultAdminContext, type AdminContextInterface } from './AdminContextType';
import axios from 'axios';

export const AdminContext = createContext<AdminContextInterface>(defaultAdminContext);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupInterface[] | undefined>(undefined);
  const [users, setUsers] = useState<AthleteInGroup[] | undefined>(undefined);
  const [adminError, setAdminError] = useState<string>('');

  const baseURL = import.meta.env.VITE_MSS_API_URL;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  async function get_all_groups() {
    try {
      const response = await axios.get(`${baseURL}/get-all-groups`, { headers: getAuthHeaders() });
      const data: GroupInterface[] = response.data.groups ?? response.data;
      setGroups(data);
      return data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  async function get_all_users() {
    try {
      const response = await axios.get(`${baseURL}/get-all-users`, { headers: getAuthHeaders() });
      const data: AthleteInGroup[] = response.data.users ?? response.data;
      setUsers(data);
      return data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  async function update_group(group_id: string, athletes_list: AthleteInGroup[], supporter_list: AthleteInGroup[]) {
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

      // Force refetch to ensure consistency
      await get_all_groups();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  async function delete_group(group_id: string) {
    try {
      await axios.delete(`${baseURL}/delete-group`, {
        headers: getAuthHeaders(),
        data: { group_id },
      });

      // Update local state immediately for responsive UI, then force refetch
      setGroups((prev) => prev?.filter((g) => g.group_id !== group_id));
      await get_all_groups();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message ?? error.message;
      setAdminError(errorMsg);
      console.error(error);
      throw error;
    }
  }

  function handleLogout() {
    setGroups(undefined);
    setUsers(undefined);
    setAdminError('');
  }

  const value: AdminContextInterface = {
    get_all_groups,
    get_all_users,
    update_group,
    delete_group,
    handleLogout,
    groups,
    users,
    adminError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};