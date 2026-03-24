import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { useAuth } from "../Auth/useAuth.ts";
import { updateMe } from "../../features/person/personApi.ts";
import { translate } from "../../i18n/config.ts";

type LocationState = {
  email?: string;
};

/**
 * Manages the onboarding form used to complete a user's profile.
 *
 * @returns Complete-profile form state, validation flags, and submit handler.
 */
export function useCompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshMe } = useAuth();
  const state = (location.state ?? {}) as LocationState;

  const email = user?.email ?? state.email ?? sessionStorage.getItem("pending_profile_email") ?? "";

  const [firstName, setFirstName] = useState(user?.person?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.person?.last_name ?? "");
  const [pseudo, setPseudo] = useState(user?.person?.pseudo ?? "");
  const [phone, setPhone] = useState(user?.person?.phone ?? "");
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
      await refreshMe();
      sessionStorage.removeItem("pending_profile_email");
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : translate("profile.updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Returns the user to the landing page.
   *
   * @returns Nothing.
   */
  function onNavigateToLanding() {
    navigate("/");
  }

  return {
    email,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    pseudo,
    setPseudo,
    phone,
    setPhone,
    isSubmitting,
    error,
    canSubmit,
    onSubmit,
    onNavigateToLanding,
  };
}
