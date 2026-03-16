import { Navigate, Outlet } from "react-router-dom";
import type { AuthPermissions } from "../types/MeResponse";
import {useAuth} from "../context/useAuth.ts";

type PermissionKey = keyof AuthPermissions;

interface PermissionRouteProps {
    permission: PermissionKey;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
    const { status, user } = useAuth();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "guest") {
        return <Navigate to="/login" replace />;
    }

    if (!user?.permissions[permission]) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}