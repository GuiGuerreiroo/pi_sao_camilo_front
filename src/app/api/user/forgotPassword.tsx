import axios from "axios";

export async function forgotPassword(email: string) {
    const baseURL= import.meta.env.VITE_MSS_API_URL

    const response = await axios.post(
        `${baseURL}/forgot-password`,
        {
            "email": email
        }
    )

    return response;
}