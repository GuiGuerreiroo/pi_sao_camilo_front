import { jwtDecode } from "jwt-decode";
import type { TokenInterface } from "../interface/tokenInterface";

interface PlainToken {
    name: string;
    email: string;
    "custom:role": string;
}

export function getDecodedToken(): TokenInterface | null {
    const token = localStorage.getItem('token');
    
    if (!token) return null;

    try {
        const rawData = jwtDecode<PlainToken>(token);
        
        return {
            name: rawData.name,
            email: rawData.email,
            role: rawData["custom:role"]
        }
    } catch {
        return null;
    }
}
