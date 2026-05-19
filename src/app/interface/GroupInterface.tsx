import type { TrainingInterface } from "./TrainingInterface";

export interface AthleteInGroup {
    user_id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    height?: number;
    trainings?: TrainingInterface[];
}

export interface GroupInterface {
    group_id: string;
    athletes_list: AthleteInGroup[];
}
