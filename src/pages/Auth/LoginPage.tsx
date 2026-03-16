import React, { useState } from "react";
import { login } from "../../features/auth/authApi.ts";
import banner from "../../assets/login-banner.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.ts";
import "../../assets/css/login.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { refreshMe } = useAuth();

    const canSubmit = email.trim().length > 7 && password.length > 7 && !isSubmitting;

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            setIsSubmitting(true);
            const data = await login({ email: email.trim(), password, password_confirmation: null });
            if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
            if (data.person_id) sessionStorage.setItem("personId", String(data.person_id));
            await refreshMe();
            navigate("/");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    function onClear() {
        setEmail("");
        setPassword("");
        setError(null);
    }

    return (
        // Root — full screen, centers content, blobs in background
        <div className="login-blobs font-dm-sans relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f4f1ec] p-4 transition-colors dark:bg-[#0c0c0f]">

            {/* Card wrapper — single column on mobile, two columns on desktop */}
            <div className="animate-fade-up relative z-10 w-full max-w-[420px] md:max-w-[860px] md:grid md:grid-cols-2 md:overflow-hidden md:rounded-[28px] md:shadow-[0_40px_100px_rgba(0,0,0,0.14)] dark:md:shadow-[0_40px_100px_rgba(0,0,0,0.6)]">

                {/* ── Left: banner panel (desktop only) ── */}
                <div className="relative hidden min-h-[560px] flex-col justify-end overflow-hidden md:flex">
                    <img src={banner} alt="covoiturage" className="absolute inset-0 h-full w-full object-cover object-center" />
                    <div className="relative z-10 bg-gradient-to-t from-black/75 to-transparent p-8">
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/15 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-orange-400 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-orange-400">
                            Covoiturage
                        </span>
                        <p className="font-syne mt-1 text-2xl font-bold leading-snug text-white">
                            Voyagez ensemble,<br />dépensez moins.
                        </p>
                        <p className="mt-1.5 text-[13px] text-white/55">
                            Rejoignez des milliers de conducteurs et passagers.
                        </p>
                    </div>
                </div>

                {/* ── Right: form panel ── */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.10)] dark:bg-[#111114] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:rounded-none md:shadow-none">

                    {/* Top bar */}
                    <div className="flex items-center justify-between border-b border-black/[0.07] bg-black/[0.02] px-5 py-3.5 dark:border-white/[0.06] dark:bg-white/[0.03]">
                        <div>
                            <p className="font-syne text-[13px] font-bold tracking-tight text-zinc-900 dark:text-white">
                                Covoiturage
                            </p>
                            <p className="mt-0.5 text-[11px] text-black/40 dark:text-white/30">
                                Authentification
                            </p>
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-orange-600 dark:border-orange-400/25 dark:bg-orange-400/12 dark:text-orange-400">
                            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-orange-500 dark:bg-orange-400" />
                            En ligne
                        </span>
                    </div>

                    {/* Form body */}
                    <div className="flex flex-col gap-6 p-6 sm:p-8">

                        {/* Banner — mobile only */}
                        <div className="aspect-[16/7] overflow-hidden rounded-2xl border border-black/[0.08] bg-[#e8e4dc] dark:border-white/[0.06] dark:bg-[#1a1a1f] md:hidden">
                            <img src={banner} alt="login banner" className="h-full w-full object-cover" />
                        </div>

                        {/* Heading */}
                        <div className="text-center">
                            <h1 className="font-syne text-[clamp(26px,6vw,34px)] font-extrabold leading-none tracking-tight text-zinc-900 dark:text-white">
                                Bon retour 👋
                            </h1>
                            <p className="mt-1.5 text-[13px] text-black/45 dark:text-white/35">
                                Connectez-vous pour continuer
                            </p>
                        </div>

                        {/* Fields + buttons */}
                        <form onSubmit={onSubmit} className="flex flex-col gap-5">

                            <div className="flex flex-col gap-3.5">
                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="email" className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-black/45 dark:text-white/40">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 dark:text-white/20">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                            </svg>
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="votre@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field w-full appearance-none rounded-[14px] border border-black/10 bg-black/[0.03] py-3 pl-[42px] pr-3.5 text-sm text-zinc-900 outline-none transition focus:border-orange-500/60 focus:bg-black/[0.05] focus:shadow-[0_0_0_3px_rgba(234,88,12,0.10)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:focus:border-orange-400/50 dark:focus:bg-white/[0.06] dark:focus:shadow-[0_0_0_3px_rgba(251,146,60,0.08)]"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="password" className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-black/45 dark:text-white/40">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/28 dark:text-white/20">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                        </span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input-field w-full appearance-none rounded-[14px] border border-black/10 bg-black/[0.03] py-3 pl-[42px] pr-11 text-sm text-zinc-900 outline-none transition focus:border-orange-500/60 focus:bg-black/[0.05] focus:shadow-[0_0_0_3px_rgba(234,88,12,0.10)] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:focus:border-orange-400/50 dark:focus:bg-white/[0.06] dark:focus:shadow-[0_0_0_3px_rgba(251,146,60,0.08)]"
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Masquer" : "Afficher"}
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/28 transition hover:text-black/70 dark:text-white/25 dark:hover:text-white/60"
                                        >
                                            {showPassword ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="animate-fade-up flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-3.5 py-3 text-[13px] text-red-700 dark:text-red-300">
                                    <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col gap-2.5">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-orange-400 to-orange-500 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.30)] transition hover:-translate-y-px hover:opacity-90 hover:shadow-[0_8px_24px_rgba(234,88,12,0.40)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                                            Connexion…
                                        </>
                                    ) : (
                                        <>
                                            Se connecter
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                                            </svg>
                                        </>
                                    )}
                                </button>

                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        {
                                            label: "Inscription",
                                            onClick: () => navigate("/register"),
                                            icon: (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                                                </svg>
                                            ),
                                        },
                                        {
                                            label: "Effacer",
                                            onClick: onClear,
                                            icon: (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                </svg>
                                            ),
                                        },
                                    ].map(({ label, onClick, icon }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={onClick}
                                            className="flex items-center justify-center gap-1.5 rounded-[14px] border border-black/10 bg-black/[0.04] py-3 text-sm font-medium text-black/65 transition hover:border-black/22 hover:bg-black/[0.08] hover:text-zinc-900 dark:border-white/[0.09] dark:bg-white/[0.05] dark:text-white/75 dark:hover:border-white/18 dark:hover:bg-white/[0.09] dark:hover:text-white"
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <p className="pt-1 text-center text-[11px] tracking-wide text-black/25 dark:text-white/18">
                            API · <span className="text-black/38 dark:text-white/28">{import.meta.env.VITE_API_BASE_URL}</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}