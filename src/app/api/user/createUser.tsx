import axios from "axios";

export interface CreateUserData {
    email: string;
    name: string;
    password?: string;
    role: string;
    height?: number;
}

export async function createUser(data: CreateUserData) {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    const response = await axios.post(
        `${baseURL}create-user`,
        {
            email: data.email,
            name: data.name,
            password: data.password,
            role: data.role,
            height: data.height
        }
    );
    
    return response.data;
}
