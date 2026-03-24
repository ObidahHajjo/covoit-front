import { Navigate, Outlet } from "react-router-dom";
import { isProfileComplete } from "../auth/profileCompletion";
import { useAuth } from "../hooks/Auth/useAuth.ts";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Redirects authenticated users away from guest-only routes.
 *
 * @returns The nested guest route outlet or a redirect/loading state.
 */
export default function GuestRoute() {
    const { status, user } = useAuth();
    const { t } = useI18n();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-8 py-10 text-center shadow-[var(--theme-shadow-warm)] backdrop-blur-xl">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
                    <p className="mt-4 font-serif text-2xl text-[var(--theme-ink)]">{t("loading.welcomeFlow")}</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("loading.welcomeFlowBody")}</p>
                </div>
            </div>
        );
    }

    if (status === "authenticated") {
        if (!isProfileComplete(user)) {
            return <Navigate to="/complete-profile" replace />;
        }

        if (user?.role?.name === 'admin' || user?.permissions?.can_manage_all_users) {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
