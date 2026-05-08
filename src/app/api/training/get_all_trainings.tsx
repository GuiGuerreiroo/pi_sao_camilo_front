import type { Training } from "../../interface/TrainingInterface";
import axios from "axios";

export async function get_all_trainings(): Promise<Training[]> {
    const baseURL = import.meta.env.VITE_MSS_API_URL;
    
    const response = await axios.get(
        `${baseURL}get-all-trainings`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    
    return response.data.trainings;
}
