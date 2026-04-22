import { getDecodedToken } from "../hooks/tokenDecode";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
    requiredRole: string;
}

export default function PrivateRoute({ requiredRole }: PrivateRouteProps) {
    try {
        const tokenData = getDecodedToken();

        // If no token data exists at all
        if (!tokenData) {
            // Clean up any residual local storage items to ensure fresh state
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            return <Navigate to="/" replace />;
        }

        // If the user role doesn't match what is required
        if (tokenData.role !== requiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }

        // If authorized, render the child routes
        return <Outlet />;

    } catch (error) {
        // If anything fails in decoding (e.g. malformed or tampered token)
        console.error('Erro ao verificar permissão:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return <Navigate to="/" replace />;
    }
}
