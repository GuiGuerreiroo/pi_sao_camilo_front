import axios from "axios";
import type { CreateTrainingInterface, TrainingInterface } from "../../interface/TrainingInterface";

export async function create_training(data: CreateTrainingInterface): Promise<TrainingInterface> {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    // Setting default fallback values for optional fields
    const payload = {
        modality: data.modality,
        start_date: Number(data.start_date),
        end_date: Number(data.end_date),
        duration: Number(data.duration ?? 0.0),
        environment_temperature: Number(data.environment_temperature ?? 0.0),
        environment_humidity: Number(data.environment_humidity ?? 0.0),
        pre_training_weight: Number(data.pre_training_weight ?? 0.0),
        post_training_weight: Number(data.post_training_weight ?? 0.0),
        pre_training_hydration: Number(data.pre_training_hydration ?? 0.0),
        during_training_hydration: Number(data.during_training_hydration ?? 0.0),
        during_training_urine_elimination: Number(data.during_training_urine_elimination ?? 0.0),
        urine_color: data.urine_color,
        soaked_clothes: Boolean(data.soaked_clothes ?? false),
        training_intensity: Number(data.training_intensity ?? 0),
        pre_training_symptoms: data.pre_training_symptoms ?? [],
        post_training_symptoms: data.post_training_symptoms ?? []
    };

    let payloadStr = JSON.stringify(payload);
    const floatFields = [
        "environment_temperature",
        "environment_humidity",
        "pre_training_weight",
        "post_training_weight",
        "pre_training_hydration",
        "during_training_hydration",
        "during_training_urine_elimination"
    ];

    floatFields.forEach(field => {
        const regex = new RegExp(`(\"${field}\"\\s*-?\\d+)(?!\\.)([,}])`, "g");
        payloadStr = payloadStr.replace(regex, '$1.0$2');
    });

    const response = await axios.post(
        `${baseURL}/create-training`,
        payloadStr,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.training;
}
