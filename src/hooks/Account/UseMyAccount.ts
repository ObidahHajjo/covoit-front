import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth.ts";
import { changePassword } from "../../features/auth/passwordApi.ts";
import { validatePassword } from "../../features/auth/passwordValidation.ts";
import { createCar, deleteCar, searchCar, updateCar } from "../../features/cars/carApi.ts";
import { getBrands } from "../../features/brands/brandApi.ts";
import { deleteMyAccount, getPerson, updateMe } from "../../features/person/personApi.ts";
import type { Brand } from "../../types/Brand.ts";
import type { Person } from "../../types/Person.ts";
import type { Car } from "../../types/Car.ts";
import { extractApiErrorMessage, extractApiFieldErrors } from "../../app/apiError.ts";
import { translate } from "../../i18n/config.ts";

/**
 * Describes the editable profile fields shown in the account page.
 */
export type ProfileFormState = {
  pseudo: string;
  first_name: string;
  last_name: string;
  phone: string;
};

/**
 * Describes the editable car fields shown in the account page.
 */
export type CarFormState = {
  brand_name: string;
  model_name: string;
  seats: string;
  license_plate: string;
  color_name: string;
  hex: string;
  delete_car: boolean;
};

/**
 * Describes the editable password fields shown in the account page.
 */
export type PasswordFormState = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

/**
 * Lists the account page sections that can be displayed.
 */
export type AccountSection = "profile" | "car";
/**
 * Maps backend field keys to validation messages.
 */
export type FieldErrors = Record<string, string[]>;

/**
 * Lists the preset car colors offered by the account form.
 *
 * @returns The default color options used by the UI.
 */
export const DEFAULT_CAR_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Red", hex: "#DC2626" },
  { name: "Green", hex: "#16A34A" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Orange", hex: "#F97316" },
  { name: "Brown", hex: "#78350F" },
];

const EMPTY_PROFILE_FORM: ProfileFormState = {
  pseudo: "",
  first_name: "",
  last_name: "",
  phone: "",
};

const EMPTY_CAR_FORM: CarFormState = {
  brand_name: "",
  model_name: "",
  seats: "",
  license_plate: "",
  color_name: "",
  hex: "#000000",
  delete_car: false,
};

const EMPTY_PASSWORD_FORM: PasswordFormState = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

/**
 * Converts a person record into the editable profile form state.
 *
 * @param person - Person record used to seed the profile form.
 * @returns Profile form values derived from the provided person.
 */
function mapPersonToProfileForm(person: Person | null): ProfileFormState {
  if (!person) return EMPTY_PROFILE_FORM;
  return {
    pseudo: person.pseudo ?? "",
    first_name: person.first_name ?? "",
    last_name: person.last_name ?? "",
    phone: person.phone ?? "",
  };
}

/**
 * Converts a person record into the editable car form state.
 *
 * @param person - Person record used to seed the car form.
 * @returns Car form values derived from the provided person.
 */
function mapPersonToCarForm(person: Person | null): CarFormState {
  if (!person) return EMPTY_CAR_FORM;
  return {
    brand_name: person.car?.model?.brand?.name ?? "",
    model_name: person.car?.model?.name ?? "",
    seats: person.car?.seats ? String(person.car.seats) : "",
    license_plate: person.car?.license_plate ?? "",
    color_name: person.car?.color?.name ?? "",
    hex: person.car?.color?.hex_code ?? "#000000",
    delete_car: false,
  };
}

/**
 * Manages profile, car, and account-deletion flows for the account page.
 *
 * @returns Account page state, validation helpers, and submit handlers.
 */
export function useMyAccount() {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const [activeSection, setActiveSection] = useState<AccountSection>("profile");
  const [person, setPerson] = useState<Person | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [carForm, setCarForm] = useState<CarFormState>(EMPTY_CAR_FORM);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);

  const [profileSaving, setProfileSaving] = useState(false);
  const [carSaving, setCarSaving] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [carSuccess, setCarSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [carError, setCarError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<FieldErrors>({});
  const passwordValidation = useMemo(
    () => validatePassword(passwordForm.password),
    [passwordForm.password],
  );
  const passwordsMatch = passwordForm.password === passwordForm.password_confirmation;
  const passwordValidationError =
    passwordForm.password.length > 0 && !passwordValidation.isValid
      ? translate("auth.passwordStrengthInvalid")
      : null;
  const passwordConfirmationError =
    passwordForm.password_confirmation.length > 0 && !passwordsMatch
      ? translate("auth.passwordsMismatch")
      : null;
  const canSubmitPassword = useMemo(() => {
    if (passwordSaving) return false;
    if (!passwordForm.current_password.trim()) return false;
    if (!passwordForm.password.trim() || !passwordForm.password_confirmation.trim()) return false;
    if (!passwordValidation.isValid) return false;
    if (!passwordsMatch) return false;
    return true;
  }, [passwordSaving, passwordForm, passwordValidation.isValid, passwordsMatch]);

  const [carSearch, setCarSearch] = useState("");
  const [carSuggestions, setCarSuggestions] = useState<Car[]>([]);
  const [carSearchLoading, setCarSearchLoading] = useState(false);
  const [carSearchError, setCarSearchError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    /**
     * Fetches the current person profile and available brands for the account screen.
     *
     * @returns A promise that resolves once the initial account state is hydrated.
     */
    async function load() {
      try {
        setLoading(true);
        const [me, brandList] = await Promise.all([getPerson(), getBrands()]);
        setPerson(me);
        setBrands(brandList);
        setProfileForm(mapPersonToProfileForm(me));
        setCarForm(mapPersonToCarForm(me));
        setCarSearch(me.car?.model?.name ?? "");
      } catch (err) {
        const message = extractApiErrorMessage(err);
        setProfileError(message);
        setCarError(message);
        setFieldErrors(extractApiFieldErrors(err));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  // ── Car search debounce ───────────────────────────────────────────────────
  useEffect(() => {
    if (carForm.delete_car) {
      setCarSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const query = carSearch.trim();
    const brand = carForm.brand_name.trim();
    if (brand === "" || query.length < 1) {
      setCarSuggestions([]);
      setCarSearchError(null);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        setCarSearchLoading(true);
        setCarSearchError(null);
        const results = await searchCar(query, brand);
        setCarSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        setCarSuggestions([]);
        setCarSearchError(extractApiErrorMessage(err));
      } finally {
        setCarSearchLoading(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [carSearch, carForm.brand_name, carForm.delete_car]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  /**
   * Clears validation errors for the provided field keys.
   *
   * @param keys - Backend field keys whose errors should be removed.
   * @returns Does not return a value.
   */
  function clearFieldError(keys: string[]) {
    setFieldErrors((prev) => {
      if (keys.every((k) => !(k in prev))) return prev;
      const next = { ...prev };
      for (const k of keys) delete next[k];
      return next;
    });
  }

  /**
   * Returns the first validation error found for the provided field keys.
   *
   * @param keys - Candidate backend field keys to inspect in order.
   * @returns The first matching validation message, or `null` when none exist.
   */
  function getFieldError(...keys: string[]): string | null {
    for (const key of keys) {
      const msgs = fieldErrors[key];
      if (Array.isArray(msgs) && msgs.length > 0) return msgs[0];
    }
    return null;
  }

  /**
   * Returns the first validation error found for the provided password field keys.
   *
   * @param keys - Candidate backend field keys to inspect in order.
   * @returns The first matching validation message, or `null` when none exist.
   */
  function getPasswordFieldError(...keys: string[]): string | null {
    for (const key of keys) {
      const msgs = passwordFieldErrors[key];
      if (Array.isArray(msgs) && msgs.length > 0) return msgs[0];
    }
    return null;
  }

  // ── Profile field update ──────────────────────────────────────────────────
  /**
   * Updates a profile field and clears related feedback state.
   *
   * @param key - Profile form field to update.
   * @param value - New value for the selected field.
   * @returns Does not return a value.
   */
  function updateProfileField<K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
    setProfileError(null);
    setProfileSuccess(null);
    clearFieldError([key]);
  }

  /**
   * Updates a password field and clears related feedback state.
   *
   * @param key - Password form field to update.
   * @param value - New value for the selected field.
   * @returns Does not return a value.
   */
  function updatePasswordField<K extends keyof PasswordFormState>(
    key: K,
    value: PasswordFormState[K],
  ) {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // ── Car field update ──────────────────────────────────────────────────────
  const carFieldErrorMap: Record<keyof CarFormState, string[]> = {
    brand_name: ["brand.name", "brand_id"],
    model_name: ["model.name", "model_name"],
    seats: ["model.seats", "seats"],
    license_plate: ["carregistration", "license_plate"],
    color_name: ["color.name", "color_name"],
    hex: ["color.hex_code", "hex", "hex_code"],
    delete_car: [],
  };

  /**
   * Updates a car field and clears related feedback state.
   *
   * @param key - Car form field to update.
   * @param value - New value for the selected field.
   * @returns Does not return a value.
   */
  function updateCarField<K extends keyof CarFormState>(key: K, value: CarFormState[K]) {
    setCarForm((prev) => ({ ...prev, [key]: value }));
    setCarError(null);
    setCarSuccess(null);
    clearFieldError(carFieldErrorMap[key] ?? []);
  }

  // ── Car-specific handlers ─────────────────────────────────────────────────
  /**
   * Updates the selected brand and clears any model-specific car search state.
   *
   * @param value - Brand name chosen in the form.
   * @returns Does not return a value.
   */
  function handleBrandChange(value: string) {
    updateCarField("brand_name", value);
    updateCarField("model_name", "");
    updateCarField("seats", "");
    setCarSearch("");
    setCarSuggestions([]);
    setShowSuggestions(false);
  }

  /**
   * Updates the free-text car model search and clears related validation feedback.
   *
   * @param value - Current text entered in the car model search field.
   * @returns Does not return a value.
   */
  function handleCarSearchChange(value: string) {
    setCarSearch(value);
    updateCarField("model_name", value);
    setShowSuggestions(true);
    clearFieldError(["model.name", "model_name", "seats"]);
  }

  /**
   * Applies a suggested car model selection to the car form.
   *
   * @param car - Suggested car record chosen by the user.
   * @returns Does not return a value.
   */
  function handleSelectSuggestion(car: Car) {
    const brandName = car.model?.brand?.name ?? carForm.brand_name;
    const modelName = car.model?.name ?? "";
    updateCarField("brand_name", brandName);
    updateCarField("model_name", modelName);
    setCarSearch(modelName);
    setCarSuggestions([]);
    setShowSuggestions(false);
  }

  /**
   * Applies one of the preset car colors to the form.
   *
   * @param name - Display name of the selected color.
   * @param hex - Hex code associated with the selected color.
   * @returns Does not return a value.
   */
  function handleSelectColor(name: string, hex: string) {
    updateCarField("color_name", name);
    updateCarField("hex", hex);
  }

  /**
   * Updates the custom car color and derives a matching label when possible.
   *
   * @param hex - Hex code entered or picked by the user.
   * @returns Does not return a value.
   */
  function handleCustomColorChange(hex: string) {
    updateCarField("hex", hex);
    const matched = DEFAULT_CAR_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
    updateCarField("color_name", matched?.name ?? translate("car.custom"));
  }

  // ── Refresh person ────────────────────────────────────────────────────────
  /**
   * Reloads account data and rehydrates the local form state.
   *
   * @returns A promise that resolves once account data is refreshed.
   */
  async function refreshPersonState() {
    const me = await getPerson();
    setPerson(me);
    setProfileForm(mapPersonToProfileForm(me));
    setCarForm(mapPersonToCarForm(me));
    setCarSearch(me.car?.model?.name ?? "");
    setCarSuggestions([]);
    setShowSuggestions(false);
  }

  // ── Submit handlers ───────────────────────────────────────────────────────
  /**
   * Persists profile form changes.
   *
   * @param event - Form submission event from the profile section.
   * @returns A promise that resolves once the save flow completes.
   */
  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setProfileSaving(true);
      setProfileError(null);
      setProfileSuccess(null);
      setFieldErrors({});
      await updateMe({
        pseudo: profileForm.pseudo.trim() || undefined,
        first_name: profileForm.first_name.trim() || undefined,
        last_name: profileForm.last_name.trim() || undefined,
        phone: profileForm.phone.trim() || undefined,
      });
      await refreshPersonState();
      setProfileSuccess(translate("profile.updatedSuccess"));
    } catch (err) {
      setProfileError(extractApiErrorMessage(err));
      setFieldErrors(extractApiFieldErrors(err));
    } finally {
      setProfileSaving(false);
    }
  }

  /**
   * Persists a password change for the current account.
   *
   * @param event - Form submission event from the password section.
   * @returns A promise that resolves once the password-update flow completes.
   */
  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitPassword) return;
    try {
      setPasswordSaving(true);
      setPasswordError(null);
      setPasswordSuccess(null);
      setPasswordFieldErrors({});
      await changePassword({
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
      });
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setPasswordSuccess(translate("profile.passwordUpdatedSuccess"));
    } catch (err) {
      setPasswordError(extractApiErrorMessage(err) || translate("profile.passwordUpdateFailed"));
      setPasswordFieldErrors(extractApiFieldErrors(err));
    } finally {
      setPasswordSaving(false);
    }
  }

  /**
   * Creates, updates, or deletes the user's car depending on form state.
   *
   * @param event - Form submission event from the car section.
   * @returns A promise that resolves once the save flow completes.
   */
  async function handleCarSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setCarSaving(true);
      setCarError(null);
      setCarSuccess(null);
      setFieldErrors({});

      let carId = person?.car?.id ?? null;

      if (carForm.delete_car && carId) {
        await deleteCar(carId);
        carId = null;
      } else if (!carForm.delete_car && carForm.model_name.trim() && carForm.license_plate.trim()) {
        const payload = {
          brand: { name: carForm.brand_name.trim() },
          type: { name: "Sedan" },
          model: {
            name: carForm.model_name.trim(),
          },
          seats: carForm.seats ? Number(carForm.seats) : undefined,
          color: { name: carForm.color_name, hex_code: carForm.hex },
          carregistration: carForm.license_plate.trim(),
        };
        if (carId) {
          const updated = await updateCar(carId, payload as never);
          carId = updated.id;
        } else {
          const created = await createCar(payload as never);
          carId = created.id;
        }
      }

      await refreshPersonState();
      await refreshMe();
      setCarSuccess(
        carForm.delete_car ? translate("car.deletedSuccess") : translate("car.updatedSuccess"),
      );
    } catch (err) {
      setCarError(extractApiErrorMessage(err));
      setFieldErrors(extractApiFieldErrors(err));
    } finally {
      setCarSaving(false);
    }
  }

  /**
   * Deletes the current account after explicit user confirmation.
   *
   * @returns A promise that resolves once the deletion flow completes.
   */
  async function handleDeleteAccount() {
    const confirmed = window.confirm(translate("profile.deleteConfirm"));
    if (!confirmed) return;
    try {
      setAccountDeleting(true);
      setDeleteAccountError(null);
      await deleteMyAccount();
      navigate("/login", { replace: true });
    } catch (err) {
      setDeleteAccountError(extractApiErrorMessage(err));
    } finally {
      setAccountDeleting(false);
    }
  }

  // ── Reset helpers ─────────────────────────────────────────────────────────
  /**
   * Restores profile form values from the latest loaded person state.
   *
   * @returns Does not return a value.
   */
  function resetProfileForm() {
    setProfileError(null);
    setProfileSuccess(null);
    setFieldErrors({});
    setProfileForm(mapPersonToProfileForm(person));
  }

  /**
   * Restores the password form to its empty state.
   *
   * @returns Does not return a value.
   */
  function resetPasswordForm() {
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordFieldErrors({});
    setPasswordForm(EMPTY_PASSWORD_FORM);
  }

  /**
   * Restores car form values from the latest loaded person state.
   *
   * @returns Does not return a value.
   */
  function resetCarForm() {
    setCarError(null);
    setCarSuccess(null);
    setFieldErrors({});
    setCarSuggestions([]);
    setShowSuggestions(false);
    setCarSearch(person?.car?.model?.name ?? "");
    setCarForm(mapPersonToCarForm(person));
  }

  const showCarDropdown = useMemo(
    () => showSuggestions && !carForm.delete_car && carSuggestions.length > 0,
    [showSuggestions, carForm.delete_car, carSuggestions.length],
  );

  return {
    // state
    activeSection,
    setActiveSection,
    person,
    brands,
    loading,
    profileForm,
    carForm,
    passwordForm,
    profileSaving,
    carSaving,
    passwordSaving,
    accountDeleting,
    profileSuccess,
    carSuccess,
    passwordSuccess,
    profileError,
    carError,
    passwordError,
    deleteAccountError,
    fieldErrors,
    passwordFieldErrors,
    canSubmitPassword,
    passwordValidationError,
    passwordConfirmationError,
    carSearch,
    carSuggestions,
    carSearchLoading,
    carSearchError,
    showCarDropdown,
    // handlers
    getFieldError,
    getPasswordFieldError,
    updateProfileField,
    updatePasswordField,
    updateCarField,
    handleBrandChange,
    handleCarSearchChange,
    handleSelectSuggestion,
    handleSelectColor,
    handleCustomColorChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleCarSubmit,
    handleDeleteAccount,
    resetProfileForm,
    resetPasswordForm,
    resetCarForm,
  };
}
