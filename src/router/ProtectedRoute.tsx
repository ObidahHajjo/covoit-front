import { Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import {useAuth} from "../context/useAuth.ts";

export default function ProtectedRoute() {
    const { status } = useAuth();

    if (status === "guest") {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout />;
}