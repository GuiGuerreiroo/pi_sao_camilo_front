/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface UpdateUserData {
    new_name?: string;
    new_height?: number;
    old_password?: string;
    new_password?: string;
}

export async function updateUser(data: UpdateUserData) {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    const body: any = {
        new_name: data.new_name,
        new_height: data.new_height,
        old_password: data.old_password,
        new_password: data.new_password,
    };

    if (data.new_name !== undefined || data.new_password !== undefined) {
        body.access_token = localStorage.getItem('access_token');
    }

    const response = await axios.put(
        `${baseURL}/update-user`,
        body,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );

    return response.data;
}