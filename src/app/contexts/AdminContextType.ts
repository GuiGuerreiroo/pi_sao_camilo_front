import type { GroupInterface, AthleteInGroup } from '../interface/GroupInterface';

export interface AdminContextInterface {
  get_all_groups: () => Promise<GroupInterface[]>;
  update_group: (group_id: string, athletes_list: AthleteInGroup[], supporter_list: AthleteInGroup[]) => Promise<void>;
  delete_group: (group_id: string) => Promise<void>;
  handleLogout: () => void;
  groups: GroupInterface[] | undefined;
  adminError: string;
}

export const defaultAdminContext: AdminContextInterface = {
  get_all_groups: async () => {
    throw new Error('get_all_groups not implemented');
  },
  update_group: async () => {
    throw new Error('update_group not implemented');
  },
  delete_group: async () => {
    throw new Error('delete_group not implemented');
  },
  handleLogout: () => {
    throw new Error('handleLogout not implemented');
  },
  groups: undefined,
  adminError: '',
};