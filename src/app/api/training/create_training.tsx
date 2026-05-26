import axios from "axios";
import type { CreateTrainingInterface, TrainingInterface } from "../../interface/TrainingInterface";

export async function create_training(data: CreateTrainingInterface): Promise<TrainingInterface> {
    const baseURL = import.meta.env.VITE_MSS_API_URL;
    
    // Setting default fallback values for optionals that backend might expect
    const payload = {
        ...data,
        during_training_hydration: data.during_training_hydration ?? 0.0,
        during_training_urine_elimination: data.during_training_urine_elimination ?? 0.0,
        pre_training_symptoms: data.pre_training_symptoms ?? [],
        post_training_symptoms: data.post_training_symptoms ?? []
    };

    const response = await axios.post(
        `${baseURL}/create-training`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    
    return response.data.training;
}
