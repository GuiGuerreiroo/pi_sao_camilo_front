export type MODALITY = "CORRIDA" | "CAMINHADA" | "CICLISMO" | "NATACAO" | "ACADEMIA" | "OUTRO" | "YOGA" | "FUTEBOL" | "BASQUETE" | "TENIS";

export type URINE_COLOR = "TRANSLUCIDO" | "AMARELO_CLARO" | "AMARELO" | "AMARELO_ESCURO" | "LARANJA" | "VERDE" | "VERDE_ESCURO" | "MARROM";

export type SYMPTOMS =
    | "CAIMBRA"
    | "ESTRESSE"
    | "DOR_MUSCULAR"
    | "NAUSEA"
    | "DOR_DE_CABECA"
    | "NENHUM";

export interface CreateTrainingInterface {
    modality: MODALITY;
    start_date: number;
    end_date: number;
    duration: number;
    environment_temperature: number;
    environment_humidity: number;
    pre_training_weight: number;
    post_training_weight: number;
    pre_training_hydration: number;
    during_training_hydration?: number;
    during_training_urine_elimination?: number;
    urine_color: URINE_COLOR;
    soaked_clothes?: boolean;
    training_intensity: number;
    pre_training_symptoms?: SYMPTOMS[];
    post_training_symptoms?: SYMPTOMS[];
}

export interface TrainingInterface {
    training_id: string;
    user_id: string;
    modality: MODALITY;

    // --- TEMPO ---
    start_date: number; // timestamp ms
    end_date: number;   // timestamp ms
    duration: number;   // minutos

    // --- CLIMA ---
    environment_temperature: number; // °C
    environment_humidity: number;    // %

    // --- PRÉ-TREINO ---
    urine_color: URINE_COLOR;
    pre_training_symptoms: SYMPTOMS[] | null;
    pre_training_weight: number;       // Kg
    pre_training_hydration: number;    // ml
    clothing_equipment: boolean | null;

    // --- DURANTE O TREINO ---
    during_training_hydration: number | null;        // ml
    during_training_urine_elimination: number | null; // ml

    // --- PÓS-TREINO ---
    post_training_symptoms: SYMPTOMS[] | null;
    post_training_weight: number;   // Kg
    soaked_clothes: boolean | null;
    training_intensity: number;     // 0–10

    // --- RESULTADOS COMPUTADOS ---
    weight_difference: number;             // Kg
    ajusted_weight_difference: number;     // L
    sudorese: number;                      // L/h
    weight_variation_percentage: number;   // %

    // --- IA ---
    ai_suggestion: string | null;
}
