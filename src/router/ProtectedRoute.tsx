import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (status === "guest") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}