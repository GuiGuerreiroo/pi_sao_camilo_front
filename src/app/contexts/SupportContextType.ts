import type { GroupInterface } from "../interface/GroupInterface";

export interface SupportContextInterface {
  get_all_groups_by_supporter: () => Promise<GroupInterface[]>;
  handleLogout: () => void;
  
  groups: GroupInterface[] | undefined;
  supportError: string;
}

export const defaultSupportContext: SupportContextInterface = {
    get_all_groups_by_supporter: async () => {
        throw new Error('get_all_groups_by_supporter not implemented')
    },
    handleLogout: () => {
        throw new Error('handleLogout not implemented')
    },
    
    groups: undefined,
    supportError: '',
}