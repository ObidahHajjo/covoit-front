import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCar, deleteCar, searchCar, updateCar } from "../../features/cars/carApi";
import { getBrands } from "../../features/brands/brandApi";
import { deleteMyAccount, getPerson, updateMe } from "../../features/person/personApi";
import type { Brand } from "../../types/Brand";
import type { Person } from "../../types/Person";
import type { Car } from "../../types/Car";
import { extractApiErrorMessage, extractApiFieldErrors } from "../../app/apiError";

type ProfileFormState = {
    pseudo: string;
    first_name: string;
    last_name: string;
    phone: string;
};

type CarFormState = {
    brand_name: string;
    model_name: string;
    seats: string;
    license_plate: string;
    color_name: string;
    hex: string;
    delete_car: boolean;
};

type AccountSection = "profile" | "car";

type FieldErrors = Record<string, string[]>;

const DEFAULT_CAR_COLORS = [
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
        seats: person.car?.model?.seats ? String(person.car.model.seats) : "",
        license_plate: person.car?.license_plate ?? "",
        color_name: person.car?.color?.name ?? "",
        hex: person.car?.color?.hex_code ?? "#000000",
        delete_car: false,
    };
}

export default function MyAccountPage() {
    const navigate = useNavigate();

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

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setProfileError(null);
                setCarError(null);
                setDeleteAccountError(null);
                setProfileSuccess(null);
                setCarSuccess(null);
                setFieldErrors({});

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

    function clearFieldError(keys: string[]) {
        setFieldErrors((prev) => {
            if (keys.every((key) => !(key in prev))) return prev;

            const next = { ...prev };
            for (const key of keys) {
                delete next[key];
            }
            return next;
        });
    }

    function updateProfileField<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
        setProfileForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setProfileError(null);
        setProfileSuccess(null);

        if (key === "pseudo") clearFieldError(["pseudo"]);
        if (key === "first_name") clearFieldError(["first_name"]);
        if (key === "last_name") clearFieldError(["last_name"]);
        if (key === "phone") clearFieldError(["phone"]);
    }

    function updateCarField<K extends keyof CarFormState>(key: K, value: CarFormState[K]) {
        setCarForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setCarError(null);
        setCarSuccess(null);

        if (key === "brand_name") clearFieldError(["brand.name", "brand_id"]);
        if (key === "model_name") clearFieldError(["model.name", "model_name"]);
        if (key === "seats") clearFieldError(["model.seats", "seats"]);
        if (key === "license_plate") clearFieldError(["carregistration", "license_plate"]);
        if (key === "color_name") clearFieldError(["color.name", "color_name"]);
        if (key === "hex") clearFieldError(["color.hex_code", "hex", "hex_code"]);
    }

    function getFieldError(...keys: string[]): string | null {
        for (const key of keys) {
            const messages = fieldErrors[key];
            if (Array.isArray(messages) && messages.length > 0) {
                return messages[0];
            }
        }
        return null;
    }

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
        clearFieldError(["model.name", "model_name", "model.seats", "seats"]);
    }

    function handleSelectSuggestion(car: Car) {
        const brandName = car.model?.brand?.name ?? carForm.brand_name;
        const modelName = car.model?.name ?? "";
        const seats = car.model?.seats != null ? String(car.model.seats) : "";

        updateCarField("brand_name", brandName);
        updateCarField("model_name", modelName);
        updateCarField("seats", seats);

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

        const matched = DEFAULT_CAR_COLORS.find(
            (color) => color.hex.toLowerCase() === hex.toLowerCase(),
        );

        updateCarField("color_name", matched?.name ?? "Custom");
    }

    async function refreshPersonState() {
        const refreshedPerson = await getPerson();
        setPerson(refreshedPerson);
        setProfileForm(mapPersonToProfileForm(refreshedPerson));
        setCarForm(mapPersonToCarForm(refreshedPerson));
        setCarSearch(refreshedPerson.car?.model?.name ?? "");
        setCarSuggestions([]);
        setShowSuggestions(false);
    }

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
                const carPayload = {
                    brand: {
                        name: carForm.brand_name.trim(),
                    },
                    type: {
                        name: "Sedan",
                    },
                    model: {
                        name: carForm.model_name.trim(),
                        seats: carForm.seats ? Number(carForm.seats) : undefined,
                    },
                    color: {
                        name: carForm.color_name,
                        hex_code: carForm.hex,
                    },
                    carregistration: carForm.license_plate.trim(),
                };

                if (carId) {
                    const updatedCar = await updateCar(carId, carPayload as never);
                    carId = updatedCar.id;
                } else {
                    const createdCar = await createCar(carPayload as never);
                    carId = createdCar.id;
                }
            }

            await updateMe({
                car_id: carId,
            });

            await refreshPersonState();
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

    const showCarDropdown = useMemo(() => {
        return showSuggestions && !carForm.delete_car && carSuggestions.length > 0;
    }, [showSuggestions, carForm.delete_car, carSuggestions.length]);

    if (loading) {
        return (
            <section className="space-y-4">
                <h1 className="text-2xl font-bold">My Account</h1>
                <div className="rounded-2xl bg-white p-4 shadow-sm">Loading...</div>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">My Account</h1>
                <p className="text-sm text-slate-500">
                    Manage your profile and car information
                </p>
            </div>

            <div className="rounded-2xl bg-white p-2 shadow-sm">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveSection("profile")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            activeSection === "profile"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Profile
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveSection("car")}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            activeSection === "car"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Car
                    </button>
                </div>
            </div>

            {activeSection === "profile" && (
                <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                    {profileSuccess ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {profileSuccess}
                        </div>
                    ) : null}

                    {profileError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {profileError}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            value={person?.email ?? ""}
                            readOnly
                            className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Pseudo</label>
                        <input
                            value={profileForm.pseudo}
                            onChange={(e) => updateProfileField("pseudo", e.target.value)}
                            placeholder="Pseudo"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("pseudo") ? (
                            <p className="text-sm text-red-600">{getFieldError("pseudo")}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">First name</label>
                        <input
                            value={profileForm.first_name}
                            onChange={(e) => updateProfileField("first_name", e.target.value)}
                            placeholder="First name"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("first_name") ? (
                            <p className="text-sm text-red-600">{getFieldError("first_name")}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Last name</label>
                        <input
                            value={profileForm.last_name}
                            onChange={(e) => updateProfileField("last_name", e.target.value)}
                            placeholder="Last name"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("last_name") ? (
                            <p className="text-sm text-red-600">{getFieldError("last_name")}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone</label>
                        <input
                            value={profileForm.phone}
                            onChange={(e) => updateProfileField("phone", e.target.value)}
                            placeholder="Phone"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("phone") ? (
                            <p className="text-sm text-red-600">{getFieldError("phone")}</p>
                        ) : null}
                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <h2 className="text-sm font-semibold text-red-700">Danger zone</h2>

                        {deleteAccountError ? (
                            <p className="mt-2 text-sm text-red-600">{deleteAccountError}</p>
                        ) : null}

                        <p className="mt-2 text-sm text-slate-600">
                            Delete your account. You have 90 days then the account will be deleted permanently.<br/>
                            To restore your account just login in 90 days.
                        </p>

                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={accountDeleting}
                            className="mt-4 rounded-xl bg-red-600 px-4 py-3 text-white disabled:opacity-60"
                        >
                            {accountDeleting ? "Deleting..." : "Delete my account"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={resetProfileForm}
                            disabled={profileSaving}
                            className="rounded-xl border px-4 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={profileSaving}
                            className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
                        >
                            {profileSaving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </form>
            )}

            {activeSection === "car" && (
                <form onSubmit={handleCarSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                    {carSuccess ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {carSuccess}
                        </div>
                    ) : null}

                    {carError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {carError}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Brand</label>
                        <select
                            value={carForm.brand_name}
                            onChange={(e) => handleBrandChange(e.target.value)}
                            disabled={carForm.delete_car}
                            className="w-full rounded-xl border px-4 py-3"
                        >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.name}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        {getFieldError("brand.name", "brand_id") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("brand.name", "brand_id")}
                            </p>
                        ) : null}
                    </div>

                    <div className="relative space-y-2">
                        <label className="text-sm font-medium text-slate-700">Model search</label>
                        <input
                            value={carSearch}
                            onChange={(e) => handleCarSearchChange(e.target.value)}
                            placeholder="Type a car model"
                            disabled={carForm.delete_car || !carForm.brand_name}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {carSearchLoading ? (
                            <p className="text-sm text-slate-500">Searching...</p>
                        ) : null}
                        {carSearchError ? (
                            <p className="text-sm text-red-600">{carSearchError}</p>
                        ) : null}

                        {showCarDropdown ? (
                            <div className="absolute z-10 w-full rounded-xl border bg-white shadow">
                                {carSuggestions.map((car) => {
                                    const brandName = car.model?.brand?.name ?? carForm.brand_name;
                                    const modelName = car.model?.name ?? "Unknown model";
                                    const seats = car.model?.seats ?? null;

                                    return (
                                        <button
                                            key={car.id}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(car)}
                                            className="block w-full px-4 py-3 text-left hover:bg-slate-50"
                                        >
                                            <div className="font-medium">
                                                {brandName} {modelName}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {seats ? `${seats} seats` : "Seats unknown"}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Selected model</label>
                        <input
                            value={carForm.model_name}
                            readOnly
                            placeholder="Select a model from suggestions"
                            className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-600"
                        />
                        {getFieldError("model.name", "model_name") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("model.name", "model_name")}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Seats</label>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={carForm.seats}
                            onChange={(e) => updateCarField("seats", e.target.value)}
                            placeholder="Seats"
                            disabled={carForm.delete_car}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("model.seats", "seats") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("model.seats", "seats")}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">License plate</label>
                        <input
                            value={carForm.license_plate}
                            onChange={(e) => updateCarField("license_plate", e.target.value)}
                            placeholder="License plate"
                            disabled={carForm.delete_car}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                        {getFieldError("carregistration", "license_plate") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("carregistration", "license_plate")}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">Color</label>

                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_CAR_COLORS.map((color) => {
                                const selected =
                                    carForm.hex.toLowerCase() === color.hex.toLowerCase();

                                return (
                                    <button
                                        key={color.hex}
                                        type="button"
                                        onClick={() => handleSelectColor(color.name, color.hex)}
                                        disabled={carForm.delete_car}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                                            selected ? "border-slate-900 ring-2 ring-slate-300" : "border-slate-300"
                                        }`}
                                    >
                                        <span
                                            className="h-4 w-4 rounded-full border border-slate-300"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span>{color.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                            <input
                                type="color"
                                value={carForm.hex}
                                onChange={(e) => handleCustomColorChange(e.target.value)}
                                disabled={carForm.delete_car}
                                className="h-12 w-20 cursor-pointer rounded-xl border bg-white p-1"
                            />

                            <div className="space-y-2">
                                <input
                                    value={carForm.color_name}
                                    onChange={(e) => updateCarField("color_name", e.target.value)}
                                    placeholder="Color name"
                                    disabled={carForm.delete_car}
                                    className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-600"
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        {getFieldError("color.name", "color_name") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("color.name", "color_name")}
                            </p>
                        ) : null}

                        {getFieldError("color.hex_code", "hex", "hex_code") ? (
                            <p className="text-sm text-red-600">
                                {getFieldError("color.hex_code", "hex", "hex_code")}
                            </p>
                        ) : null}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={carForm.delete_car}
                            onChange={(e) => updateCarField("delete_car", e.target.checked)}
                        />
                        Delete my car
                    </label>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            type="button"
                            onClick={resetCarForm}
                            disabled={carSaving}
                            className="rounded-xl border px-4 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={carSaving}
                            className="rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
                        >
                            {carSaving ? "Saving..." : "Save car"}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}