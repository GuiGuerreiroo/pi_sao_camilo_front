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

      const validSymptoms = ["CAIMBRA", "ESTRESSE", "DOR_MUSCULAR", "NAUSEA", "DOR_DE_CABECA", "NENHUM"];

      const payload = {
        modality: data.modality,
        start_date: Number(data.start_date ?? Date.now()),
        end_date: Number(data.end_date ?? Date.now()),
        duration: Number(data.duration ?? 0.0),
        environment_temperature: Number(data.environment_temperature ?? 0.0),
        environment_humidity: Number(data.environment_humidity ?? 0.0),
        pre_training_weight: Number(data.pre_training_weight ?? 0.0),
        post_training_weight: Number(data.post_training_weight ?? 0.0),
        pre_training_hydration: Number(data.pre_training_hydration ?? 0.0),
        during_training_hydration: Number(data.during_training_hydration ?? 0.0),
        during_training_urine_elimination: Number(data.during_training_urine_elimination ?? 0.0),
        urine_color: data.urine_color,
        soaked_clothes: Boolean(data.soaked_clothes),
        training_intensity: Number(data.training_intensity ?? 0.0),
        pre_training_symptoms: (data.pre_training_symptoms ?? []).filter(s => validSymptoms.includes(s)),
        post_training_symptoms: (data.post_training_symptoms ?? []).filter(s => validSymptoms.includes(s))
      };

      let payloadStr = JSON.stringify(payload);
      const floatFields = [
        "duration",
        "environment_temperature",
        "environment_humidity",
        "pre_training_weight",
        "post_training_weight",
        "pre_training_hydration",
        "during_training_hydration",
        "during_training_urine_elimination",
        "training_intensity"
      ];

      floatFields.forEach(field => {
        const regex = new RegExp(`("${field}":\\s*-?\\d+)(?!\\.)([,}])`, 'g');
        payloadStr = payloadStr.replace(regex, '$1.0$2');
      });

      const response = await this.http.post<{ training: TrainingInterface }>(
        `${this.baseURL}/create-training`,
        payloadStr,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      return response.data.training;
    } catch (error: any) {
      console.error('Detailed create_training Error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error creating training: ${errorMessage}`);
    }
  }
}
