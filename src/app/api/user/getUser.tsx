import type { UserInterface } from "@/app/interface/UserInterface";
import axios from "axios";

export async function getUser(): Promise<UserInterface> {

    const baseURL= import.meta.env.VITE_MSS_API_URL

    
    const response = await axios.get(
        `${baseURL}get-user`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
    console.log(response.data);

    localStorage.setItem('user', JSON.stringify(response.data.user))

    return response.data.user;
}