import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { updateMe } from "../../features/person/personApi";

type LocationState = {
    email?: string;
};

export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state ?? {}) as LocationState;

    const emailFromState = state.email;
    const emailFromStorage = sessionStorage.getItem("pending_profile_email") ?? undefined;
    const email = emailFromState ?? emailFromStorage ?? "";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [phone, setPhone] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        if (isSubmitting) return false;
        if (!email) return false;
        if (firstName.trim().length < 2) return false;
        if (lastName.trim().length < 2) return false;
        if (pseudo.trim().length < 3) return false;
        return true;
    }, [email, firstName, lastName, pseudo, isSubmitting]);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setIsSubmitting(true);

            await updateMe({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                pseudo: pseudo.trim(),
                phone: phone.trim().length ? phone.trim() : null,
            });

            sessionStorage.removeItem("pending_profile_email");

            // Redirect after profile completion (choose your page)
            navigate("/loign");
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Profile update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-3xl bg-zinc-900/60 backdrop-blur border border-zinc-800 shadow-xl overflow-hidden">
                {/* Top bar */}
                <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800">
                    <div className="text-sm font-medium text-zinc-200">Profil</div>
                    <div className="text-xs text-zinc-400">Compléter votre profil</div>
                </div>

                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-center">
                        Complete Profile
                    </h1>

                    {/* Email readonly */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                        <div className="text-xs text-zinc-500">Email</div>
                        <div className="text-sm text-zinc-200 break-all">{email || "—"}</div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">First name</label>
                            <input
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Last name</label>
                            <input
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Pseudo</label>
                            <input
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                                placeholder="Pseudo"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Phone (optional)</label>
                            <input
                                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                                placeholder="+33..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full rounded-xl px-4 py-3 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "..." : "Save profile"}
                        </button>

                        {!email && (
                            <p className="text-xs text-zinc-500 text-center">
                                Missing email. Go back to register.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}