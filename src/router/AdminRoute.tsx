import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth/useAuth";

export default function AdminRoute() {
    const { status, user } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--theme-surface)]">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
            </div>
        );
    }

    if (status === "guest") {
        return <Navigate to="/login" replace />;
    }

    // Assuming the user object has a role or is_admin flag. 
    // Fallback: Check if they have the 'can_manage_all_users' permission
    const isAdmin = user?.role?.name === 'admin' || user?.permissions?.can_manage_all_users;

    if (!isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
