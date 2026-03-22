import { Navigate, Outlet } from "react-router-dom";
import { isProfileComplete } from "../auth/profileCompletion";
import { useAuth } from "../context/useAuth.ts";

/**
 * Redirects authenticated users away from guest-only routes.
 *
 * @returns The nested guest route outlet or a redirect/loading state.
 */
export default function GuestRoute() {
    const { status, user } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] px-8 py-10 text-center shadow-[var(--theme-shadow-warm)] backdrop-blur-xl">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(23,48,31,0.12)] border-t-[var(--theme-coral)]" />
                    <p className="mt-4 font-serif text-2xl text-[var(--theme-ink)]">Preparing the welcome flow...</p>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">A quick session check before we show the sign-in pages.</p>
                </div>
            </div>
        );
    }

    if (status === "authenticated") {
        if (!isProfileComplete(user)) {
            return <Navigate to="/complete-profile" replace />;
        }

        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
