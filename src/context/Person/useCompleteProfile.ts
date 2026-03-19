import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type React from "react";
import { updateMe } from "../../features/person/personApi";

type LocationState = {
  email?: string;
};

export function useCompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const email =
    state.email ??
    sessionStorage.getItem("pending_profile_email") ??
    "";

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
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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
  };
}
