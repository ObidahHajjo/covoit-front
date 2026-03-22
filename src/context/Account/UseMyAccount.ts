import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { createCar, deleteCar, searchCar, updateCar } from "../../features/cars/carApi";
import { getBrands } from "../../features/brands/brandApi";
import { deleteMyAccount, getPerson, updateMe } from "../../features/person/personApi";
import type { Brand } from "../../types/Brand";
import type { Person } from "../../types/Person";
import type { Car } from "../../types/Car";
import { extractApiErrorMessage, extractApiFieldErrors } from "../../app/apiError";

export type ProfileFormState = {
    pseudo: string;
    first_name: string;
    last_name: string;
    phone: string;
};

export type CarFormState = {
    brand_name: string;
    model_name: string;
    seats: string;
    license_plate: string;
    color_name: string;
    hex: string;
    delete_car: boolean;
};

export type AccountSection = "profile" | "car";
export type FieldErrors = Record<string, string[]>;

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

function mapPersonToProfileForm(person: Person | null): ProfileFormState {
    if (!person) return EMPTY_PROFILE_FORM;
    return {
        pseudo: person.pseudo ?? "",
        first_name: person.first_name ?? "",
        last_name: person.last_name ?? "",
        phone: person.phone ?? "",
    };
}

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

export function useMyAccount() {
    const navigate = useNavigate();
    const { refreshMe } = useAuth();

    const [activeSection, setActiveSection] = useState<AccountSection>("profile");
    const [person, setPerson] = useState<Person | null>(null);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
    const [carForm, setCarForm] = useState<CarFormState>(EMPTY_CAR_FORM);

    const [profileSaving, setProfileSaving] = useState(false);
    const [carSaving, setCarSaving] = useState(false);
    const [accountDeleting, setAccountDeleting] = useState(false);

    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [carSuccess, setCarSuccess] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [carError, setCarError] = useState<string | null>(null);
    const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const [carSearch, setCarSearch] = useState("");
    const [carSuggestions, setCarSuggestions] = useState<Car[]>([]);
    const [carSearchLoading, setCarSearchLoading] = useState(false);
    const [carSearchError, setCarSearchError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // ── Initial load ──────────────────────────────────────────────────────────
    useEffect(() => {
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
    function clearFieldError(keys: string[]) {
        setFieldErrors((prev) => {
            if (keys.every((k) => !(k in prev))) return prev;
            const next = { ...prev };
            for (const k of keys) delete next[k];
            return next;
        });
    }

    function getFieldError(...keys: string[]): string | null {
        for (const key of keys) {
            const msgs = fieldErrors[key];
            if (Array.isArray(msgs) && msgs.length > 0) return msgs[0];
        }
        return null;
    }

    // ── Profile field update ──────────────────────────────────────────────────
    function updateProfileField<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
        setProfileForm((prev) => ({ ...prev, [key]: value }));
        setProfileError(null);
        setProfileSuccess(null);
        clearFieldError([key]);
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

    function updateCarField<K extends keyof CarFormState>(key: K, value: CarFormState[K]) {
        setCarForm((prev) => ({ ...prev, [key]: value }));
        setCarError(null);
        setCarSuccess(null);
        clearFieldError(carFieldErrorMap[key] ?? []);
    }

    // ── Car-specific handlers ─────────────────────────────────────────────────
    function handleBrandChange(value: string) {
        updateCarField("brand_name", value);
        updateCarField("model_name", "");
        updateCarField("seats", "");
        setCarSearch("");
        setCarSuggestions([]);
        setShowSuggestions(false);
    }

    function handleCarSearchChange(value: string) {
        setCarSearch(value);
        updateCarField("model_name", value);
        setShowSuggestions(true);
        clearFieldError(["model.name", "model_name", "seats"]);
    }

    function handleSelectSuggestion(car: Car) {
        const brandName = car.model?.brand?.name ?? carForm.brand_name;
        const modelName = car.model?.name ?? "";
        updateCarField("brand_name", brandName);
        updateCarField("model_name", modelName);
        setCarSearch(modelName);
        setCarSuggestions([]);
        setShowSuggestions(false);
    }

    function handleSelectColor(name: string, hex: string) {
        updateCarField("color_name", name);
        updateCarField("hex", hex);
    }

    function handleCustomColorChange(hex: string) {
        updateCarField("hex", hex);
        const matched = DEFAULT_CAR_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
        updateCarField("color_name", matched?.name ?? "Custom");
    }

    // ── Refresh person ────────────────────────────────────────────────────────
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
            setProfileSuccess("Profile updated successfully.");
        } catch (err) {
            setProfileError(extractApiErrorMessage(err));
            setFieldErrors(extractApiFieldErrors(err));
        } finally {
            setProfileSaving(false);
        }
    }

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
            setCarSuccess(carForm.delete_car ? "Car deleted successfully." : "Car updated successfully.");
        } catch (err) {
            setCarError(extractApiErrorMessage(err));
            setFieldErrors(extractApiFieldErrors(err));
        } finally {
            setCarSaving(false);
        }
    }

    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone.",
        );
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
    function resetProfileForm() {
        setProfileError(null);
        setProfileSuccess(null);
        setFieldErrors({});
        setProfileForm(mapPersonToProfileForm(person));
    }

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
        profileSaving,
        carSaving,
        accountDeleting,
        profileSuccess,
        carSuccess,
        profileError,
        carError,
        deleteAccountError,
        fieldErrors,
        carSearch,
        carSuggestions,
        carSearchLoading,
        carSearchError,
        showCarDropdown,
        // handlers
        getFieldError,
        updateProfileField,
        updateCarField,
        handleBrandChange,
        handleCarSearchChange,
        handleSelectSuggestion,
        handleSelectColor,
        handleCustomColorChange,
        handleProfileSubmit,
        handleCarSubmit,
        handleDeleteAccount,
        resetProfileForm,
        resetCarForm,
    };
}
