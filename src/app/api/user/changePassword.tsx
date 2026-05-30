import axios from "axios";

export async function changePassword(email: string, code: string, newPassword: string) {
    const baseURL= import.meta.env.VITE_MSS_API_URL

    const response = await axios.put(
        `${baseURL}/change-password`,
        {
            "email": email,
            "code": code,
            "new_password": newPassword
        }
    )

    return response;
}