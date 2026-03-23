import { Navigate, Outlet } from "react-router-dom";
import type { AuthPermissions } from "../types/MeResponse";
import { isProfileComplete } from "../auth/profileCompletion";
import {useAuth} from "../hooks/Auth/useAuth.ts";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Lists the permission keys available on the authenticated user object.
 */
type PermissionKey = keyof AuthPermissions;

/**
 * Describes the props accepted by the permission-based route guard.
 */
interface PermissionRouteProps {
    /**
     * Permission required to access the nested route.
     */
    permission: PermissionKey;
}

/**
 * Guards routes that require a specific permission on the authenticated user.
 *
 * @param props - Component props.
 * @param props.permission - Permission key required to render the nested route.
 * @returns The nested route outlet or a redirect/loading state.
 */
export default function PermissionRoute({ permission }: PermissionRouteProps) {
    const { status, user } = useAuth();
    const { t } = useI18n();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-8 py-10 text-center shadow-[var(--theme-shadow-warm)] backdrop-blur-xl">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
                    <p className="mt-4 font-serif text-2xl text-[var(--theme-ink)]">{t("loading.permission")}</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("loading.permissionBody")}</p>
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
