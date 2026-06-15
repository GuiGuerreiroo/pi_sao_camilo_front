import type { UserInterface } from "../interface/UserInterface";
import type { TrainingInterface } from "../interface/TrainingInterface";

export interface AthleteContextInterface {
  getUser: () => Promise<UserInterface>;
  get_all_trainings: () => Promise<TrainingInterface[]>;
  handleLogout: () => void;
  
  user: UserInterface | undefined;
  trainings: TrainingInterface[] | undefined;
  athleteError: string;
}


export const defaultAthleteContext: AthleteContextInterface = {
    getUser: async () => {
        throw new Error('getUser not implemented')
    },
    get_all_trainings: async () => {
        throw new Error('get_all_trainings not implemented')
    },
    handleLogout: () => {
        throw new Error('handleLogout not implemented')
    },
    
    user: undefined,
    trainings: undefined,
    athleteError: '',
}