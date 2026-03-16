import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth.ts";

export default function GuestRoute() {
    const { status } = useAuth();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "authenticated") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}