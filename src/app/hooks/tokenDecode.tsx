import { jwtDecode } from "jwt-decode";
import type { TokenInterface } from "../interface/tokenInterface";

export function getDecodedToken(): TokenInterface | null {
    const token = localStorage.getItem('token');
    
    if (!token) return null;

    try {
        const rawData = jwtDecode<any>(token);
        
        return {
            name: rawData.name,
            email: rawData.email,
            role: rawData["custom:role"]
        };
    } catch {
        return null;
    }
}
