import { Navigate, Outlet } from "react-router-dom";

export default function PrivatePROFRoutes() {
    const token = localStorage.getItem('token');

    try {
        const tokenData = localStorage.getItem('token')!;

        if (token && (tokenData.role === "ADMIN")) {
            return <Outlet />;
        }
        else {
            return <Navigate to='/error' />
        }
    }
    catch (error) {
        console.log('Erro ao decodificar o token:', error)
        return <Navigate to='/' />
    }
}