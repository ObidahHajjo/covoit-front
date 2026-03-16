import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        return null; // or a splash screen / loader
    }

    if (status === "guest") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}