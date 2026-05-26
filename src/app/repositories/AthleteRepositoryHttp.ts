import type { AxiosInstance } from "axios";
import type { UserInterface } from "../interface/UserInterface";
import type { TrainingInterface, CreateTrainingInterface } from "../interface/TrainingInterface";

export interface IAthleteRepository {
  getUser(): Promise<UserInterface>;
  get_all_trainings(): Promise<TrainingInterface[]>;
  create_training(data: CreateTrainingInterface): Promise<TrainingInterface>;
}

export class AthleteRepositoryHttp implements IAthleteRepository {
  private baseURL: string;
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
    this.baseURL = import.meta.env.VITE_MSS_API_URL || '';
  }

  async getUser(): Promise<UserInterface> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await this.http.get<{ user: UserInterface }>(
        `${this.baseURL}/get-user`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
      
    } catch (error: any) {
      console.error('Detailed getUser Error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error fetching user: ${errorMessage}`);
    }
  }

  async get_all_trainings(): Promise<TrainingInterface[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await this.http.get<{ trainings: TrainingInterface[] }>(
        `${this.baseURL}/get-all-trainings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.trainings;
    } catch (error: any) {
      console.error('Detailed get_all_trainings Error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error fetching trainings: ${errorMessage}`);
    }
  }

  async create_training(data: CreateTrainingInterface): Promise<TrainingInterface> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const payload = {
        ...data,
        during_training_hydration: data.during_training_hydration ?? 0.0,
        during_training_urine_elimination: data.during_training_urine_elimination ?? 0.0,
        pre_training_symptoms: data.pre_training_symptoms ?? [],
        post_training_symptoms: data.post_training_symptoms ?? []
      };

      const response = await this.http.post<{ training: TrainingInterface }>(
        `${this.baseURL}/create-training`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.training;
    } catch (error: any) {
      console.error('Detailed create_training Error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error creating training: ${errorMessage}`);
    }
  }
}
