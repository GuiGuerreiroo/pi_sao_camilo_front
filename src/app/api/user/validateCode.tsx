import axios from "axios";

export interface ValidateCodeData {
    email: string;
    code: string;
}

export async function validateCode(data: ValidateCodeData) {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    const response = await axios.post(
        `${baseURL}confirm-user`,
        {
            email: data.email,
            code: data.code
        }
    );

    return response.data;
}
