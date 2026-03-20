import { Navigate, Outlet } from "react-router-dom";
import type { AuthPermissions } from "../types/MeResponse";
import { isProfileComplete } from "../auth/profileCompletion";
import {useAuth} from "../context/useAuth.ts";

type PermissionKey = keyof AuthPermissions;

interface PermissionRouteProps {
    permission: PermissionKey;
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
    const { status, user } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-8 py-10 text-center shadow-[var(--theme-shadow-warm)] backdrop-blur-xl">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
                    <p className="mt-4 font-serif text-2xl text-[var(--theme-ink)]">Checking access...</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">We are confirming which routes are available for your account.</p>
                </div>
            </div>
        );
    }

    if (status === "guest") {
        return <Navigate to="/login" replace />;
    }

    if (!isProfileComplete(user)) {
        return <Navigate to="/complete-profile" replace />;
    }

    if (!user?.permissions[permission]) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
