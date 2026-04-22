export type MODALITY = "FUTEBOL" | "CORRIDA" | "NATACAO" | "CICLISMO" | "BASQUETE" | "VOLEI" | "TENIS" | "MUSCULACAO" | "OUTRO";

export type URINE_COLOR = "TRANSPARENTE" | "AMARELO_CLARO" | "AMARELO" | "AMARELO_ESCURO" | "LARANJA" | "MARROM";

export type SYMPTOMS =
    | "NENHUM"
    | "DOR_DE_CABECA"
    | "TONTURA"
    | "NAUSEA"
    | "FADIGA"
    | "CAIBRA"
    | "SEDE_EXCESSIVA"
    | "BOCA_SECA"
    | "FRAQUEZA"
    | "CONFUSAO_MENTAL";

export interface Training {
    training_id: string;
    user_id: string;
    modality: MODALITY;

    // --- TEMPO ---
    start_date: number; // timestamp ms
    end_date: number;   // timestamp ms
    duration: number;   // segundos

    // --- CLIMA ---
    environment_temperature: number; // °C
    environment_humidity: number;    // %

    // --- PRÉ-TREINO ---
    urine_color: URINE_COLOR;
    pre_training_symptoms: SYMPTOMS[];
    pre_training_weight: number;       // Kg
    pre_training_hydration: number;    // ml
    clothing_equipment: boolean | null;

    // --- DURANTE O TREINO ---
    during_training_hydration: number;        // ml
    during_training_urine_elimination: number; // ml

    // --- PÓS-TREINO ---
    post_training_symptoms: SYMPTOMS[];
    post_training_weight: number;   // Kg
    soaked_clothes: boolean | null;
    training_intensity: number;     // 0–10

    // --- RESULTADOS COMPUTADOS ---
    weight_difference: number;             // Kg
    ajusted_weight_difference: number;     // L/Kg
    hydric_balance: number;                // ml
    sudorese: number;                      // ml/h
    weight_variation_percentage: number;   // %

    // --- IA ---
    ai_suggestion: string | null;
}
