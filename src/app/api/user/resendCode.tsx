import axios from "axios";

export async function resendCode(email: string) {
    const baseURL = import.meta.env.VITE_MSS_API_URL;

    const response = await axios.post(
        `${baseURL}/resend-code`,
        {
            email: email
        }
    );

    return response.data;
}
