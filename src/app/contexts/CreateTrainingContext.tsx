import { createContext, useState, type ReactNode } from 'react';
import type { CreateTrainingInterface, TrainingInterface } from '../interface/TrainingInterface';
import { AthleteRepositoryHttp } from '../repositories/AthleteRepositoryHttp';
import axios from 'axios';

const http = axios;
const athleteRepository = new AthleteRepositoryHttp(http);

export interface CreateTrainingContextType {
    trainingData: Partial<CreateTrainingInterface>;
    updateTrainingData: (data: Partial<CreateTrainingInterface>) => void;
    submitTraining: () => Promise<TrainingInterface | void>;
    resetTrainingData: () => void;
    isLoading: boolean;
    error: string | null;
}

export const defaultCreateTrainingContext: CreateTrainingContextType = {
    trainingData: {},
    updateTrainingData: () => {},
    submitTraining: async () => {},
    resetTrainingData: () => {},
    isLoading: false,
    error: null,
};

export const CreateTrainingContext = createContext<CreateTrainingContextType>(defaultCreateTrainingContext);

export const CreateTrainingProvider = ({ children }: { children: ReactNode }) => {
    const [trainingData, setTrainingData] = useState<Partial<CreateTrainingInterface>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTrainingData = (data: Partial<CreateTrainingInterface>) => {
        setTrainingData((prev) => ({ ...prev, ...data }));
    };

    const resetTrainingData = () => {
        setTrainingData({});
        setError(null);
    };

    const submitTraining = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Check if all required fields are present before submitting
            // Type casting to CreateTrainingInterface since the API expects it.
            const response = await athleteRepository.create_training(trainingData as CreateTrainingInterface);
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
