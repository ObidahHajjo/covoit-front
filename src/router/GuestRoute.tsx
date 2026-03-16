import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.ts";

export default function GuestRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (status === "authenticated") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}