/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react-refresh/only-export-components, no-empty */
import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { CreateTrainingInterface, TrainingInterface, MODALITY } from '../interface/TrainingInterface';
import { AthleteRepositoryHttp } from '../repositories/AthleteRepositoryHttp';
import axios from 'axios';

const http = axios;
const athleteRepository = new AthleteRepositoryHttp(http);

export interface CreateTrainingContextType {
    trainingData: Partial<CreateTrainingInterface>;
    updateTrainingData: (data: Partial<CreateTrainingInterface>) => void;
    startTrainingFlow: (modality: MODALITY) => void;
    submitTraining: (data?: Partial<CreateTrainingInterface>) => Promise<TrainingInterface | void>;
    resetTrainingData: () => void;
    isLoading: boolean;
    error: string | null;
}

export const defaultCreateTrainingContext: CreateTrainingContextType = {
    trainingData: {},
    updateTrainingData: () => {},
    startTrainingFlow: () => {},
    submitTraining: async () => {},
    resetTrainingData: () => {},
    isLoading: false,
    error: null,
};

export const CreateTrainingContext = createContext<CreateTrainingContextType>(defaultCreateTrainingContext);

export const CreateTrainingProvider = ({ children }: { children: ReactNode }) => {
    const [trainingData, setTrainingData] = useState<Partial<CreateTrainingInterface>>(() => {
        const saved = sessionStorage.getItem("trainingData");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return {};
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Save to sessionStorage whenever trainingData changes
    useEffect(() => {
        sessionStorage.setItem("trainingData", JSON.stringify(trainingData));
    }, [trainingData]);

    const updateTrainingData = (data: Partial<CreateTrainingInterface>) => {
        setTrainingData((prev) => {
            console.log("Updating training data. Previous:", prev, "New:", data);
            return { ...prev, ...data };
        });
    };

    const startTrainingFlow = (modality: MODALITY) => {
        setTrainingData({
            modality,
            start_date: new Date().getTime()
        });
        setError(null);
    };

    const resetTrainingData = () => {
        setTrainingData({});
        sessionStorage.removeItem("trainingData");
        setError(null);
    };

    const submitTraining = async (data?: Partial<CreateTrainingInterface>) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload = { ...trainingData, ...data } as CreateTrainingInterface;
            // Check if all required fields are present before submitting
            // Type casting to CreateTrainingInterface since the API expects it.
            const response = await athleteRepository.create_training(payload);
            resetTrainingData();
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CreateTrainingContext.Provider
            value={{
                trainingData,
                updateTrainingData,
                startTrainingFlow,
                submitTraining,
                resetTrainingData,
                isLoading,
                error
            }}
        >
            {children}
        </CreateTrainingContext.Provider>
    );
};
