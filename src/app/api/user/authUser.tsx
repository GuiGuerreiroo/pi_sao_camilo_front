import type { ILoginForm } from "../../interface/loginValidation";
import axios from "axios";


export async function authUser(data: ILoginForm) {
    const baseURL= import.meta.env.VITE_MSS_API_URL

    const response = await axios.post(
        `${baseURL}auth-user`,
        {
            "email": data.email,
            "password": data.password
        }
    )
    // armazenando token
    localStorage.setItem('token', response.data.id_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    // armazenando usuario
    // localStorage.setItem('user', JSON.stringify(response.data.user))
}