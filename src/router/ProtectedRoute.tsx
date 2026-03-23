import { Navigate, useLocation } from "react-router-dom";
import { isProfileComplete } from "../auth/profileCompletion";
import { useAuth } from "../hooks/Auth/useAuth.ts";
import AppLayout from "../components/layout/AppLayout.tsx";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Guards authenticated routes and redirects incomplete profiles when needed.
 *
 * @returns The protected app layout or a redirect/loading state.
 */
export default function ProtectedRoute() {
    const { status, user } = useAuth();
    const location = useLocation();
    const { t } = useI18n();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-8 py-10 text-center shadow-[var(--theme-shadow-warm)] backdrop-blur-xl">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
                    <p className="mt-4 font-serif text-2xl text-[var(--theme-ink)]">{t("loading.dashboardGate")}</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("loading.dashboardGateBody")}</p>
                </div>
            </div>
        );
    }

    if (status === "guest") {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!isProfileComplete(user)) {
        return <Navigate to="/complete-profile" replace state={{ from: location }} />;
    }

    return <AppLayout />;
}
