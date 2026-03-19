import type React from "react";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (value: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onGoBack: () => void;
  onNavigateToLogin: () => void;
};

export function RegisterSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  isSubmitting,
  canSubmit,
  error,
  onSubmit,
  onCancel,
  onGoBack,
  onNavigateToLogin,
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900/60 backdrop-blur border border-zinc-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3">
          <button
            type="button"
            onClick={onGoBack}
            className="h-9 w-9 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 flex items-center justify-center"
            aria-label="Back"
          >
            <span className="text-lg leading-none">←</span>
          </button>

          <div>
            <div className="text-sm font-medium text-zinc-200">Inscription</div>
            <div className="text-xs text-zinc-400">Créer un compte</div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Email</label>
              <input
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                placeholder="e.g. example@test.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                autoComplete="email"
              />
              <p className="text-xs text-zinc-500">Min. 7 caractères</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Mot de passe</label>
              <input
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                autoComplete="new-password"
              />
              <p className="text-xs text-zinc-500">Min. 6 caractères</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Confirmation</label>
              <input
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600"
                type="password"
                placeholder="Mot de passe"
                value={passwordConfirm}
                onChange={(e) => onPasswordConfirmChange(e.target.value)}
                autoComplete="new-password"
              />
              {passwordConfirm.length > 0 && password !== passwordConfirm && (
                <p className="text-xs text-red-300">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl px-4 py-3 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "Valider l'inscription"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl px-4 py-3 text-sm font-medium bg-zinc-950 border border-zinc-800 hover:border-zinc-600"
              >
                Annuler
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-zinc-500">
            Déjà un compte ?{" "}
            <button
              className="text-zinc-200 underline underline-offset-4 hover:text-white"
              onClick={onNavigateToLogin}
              type="button"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
