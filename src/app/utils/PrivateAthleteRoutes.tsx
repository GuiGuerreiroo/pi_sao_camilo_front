import { Navigate, Outlet } from "react-router-dom";

export default function PrivateAthleteRoutes() {

    try {
        return <Outlet />;
    }

    catch (error) {
        console.log('Erro ao decodificar o token:', error)
        return <Navigate to='/' />
    }
}