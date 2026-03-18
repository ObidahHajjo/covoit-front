import type { FormEvent } from "react";
import type { Brand } from "../../types/Brand";
import type { Car } from "../../types/Car";
import type { CarFormState } from "../../context/Account/UseMyAccount";
import { DEFAULT_CAR_COLORS } from "../../context/Account/UseMyAccount";

type Props = {
    form: CarFormState;
    brands: Brand[];
    saving: boolean;
    success: string | null;
    error: string | null;
    getFieldError: (...keys: string[]) => string | null;
    carSearch: string;
    carSuggestions: Car[];
    carSearchLoading: boolean;
    carSearchError: string | null;
    showCarDropdown: boolean;
    onFieldChange: <K extends keyof CarFormState>(key: K, value: CarFormState[K]) => void;
    onBrandChange: (value: string) => void;
    onCarSearchChange: (value: string) => void;
    onSelectSuggestion: (car: Car) => void;
    onSelectColor: (name: string, hex: string) => void;
    onCustomColorChange: (hex: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
};

function Field({
                   label,
                   error,
                   children,
               }: {
    label: string;
    error?: string | null;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </label>
            {children}
            {error ? (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function CarSection({
                               form,
                               brands,
                               saving,
                               success,
                               error,
                               getFieldError,
                               carSearch,
                               carSuggestions,
                               carSearchLoading,
                               carSearchError,
                               showCarDropdown,
                               onFieldChange,
                               onBrandChange,
                               onCarSearchChange,
                               onSelectSuggestion,
                               onSelectColor,
                               onCustomColorChange,
                               onSubmit,
                               onReset,
                           }: Props) {
    const inputClass =
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50";

    const hasCar = !form.delete_car && (form.brand_name || form.model_name);

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {success ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                    <p className="text-sm font-medium text-emerald-700">{success}</p>
                </div>
            ) : null}

            {error ? (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            ) : null}

            {/* Car preview card */}
            <div
                className={`rounded-2xl border p-4 transition-all ${
                    form.delete_car
                        ? "border-rose-200 bg-rose-50/60"
                        : hasCar
                            ? "border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50"
                            : "border-dashed border-slate-200 bg-slate-50"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all ${
                            form.delete_car
                                ? "bg-rose-100 text-rose-400"
                                : hasCar
                                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow"
                                    : "bg-slate-100 text-slate-300"
                        }`}
                    >
                        🚗
                    </div>
                    <div>
                        {form.delete_car ? (
                            <p className="text-sm font-semibold text-rose-600">Car will be removed</p>
                        ) : hasCar ? (
                            <>
                                <p className="text-sm font-semibold text-slate-800">
                                    {form.brand_name} {form.model_name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {form.seats ? `${form.seats} seats` : ""}
                                    {form.seats && form.license_plate ? " · " : ""}
                                    {form.license_plate || ""}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-slate-400">No car registered yet</p>
                        )}
                    </div>
                    {hasCar && !form.delete_car && (
                        <div
                            className="ml-auto h-6 w-6 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: form.hex }}
                        />
                    )}
                </div>
            </div>

            <Field label="Brand" error={getFieldError("brand.name", "brand_id")}>
                <select
                    value={form.brand_name}
                    onChange={(e) => onBrandChange(e.target.value)}
                    disabled={form.delete_car}
                    className={inputClass}
                >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </Field>

            <Field label="Model search" error={getFieldError("model.name", "model_name")}>
                <div className="relative">
                    <input
                        value={carSearch}
                        onChange={(e) => onCarSearchChange(e.target.value)}
                        placeholder={form.brand_name ? "Type a model name…" : "Select a brand first"}
                        disabled={form.delete_car || !form.brand_name}
                        className={inputClass}
                    />
                    {carSearchLoading && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            Searching…
                        </span>
                    )}
                    {showCarDropdown && (
                        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            {carSuggestions.map((car) => {
                                const brandName = car.model?.brand?.name ?? form.brand_name;
                                const modelName = car.model?.name ?? "Unknown model";
                                const seats = car.model?.seats ?? null;
                                return (
                                    <button
                                        key={car.id}
                                        type="button"
                                        onClick={() => onSelectSuggestion(car)}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-violet-50"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm">
                                            🚗
                                        </span>
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-800">
                                                {brandName} {modelName}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {seats ? `${seats} seats` : "Seats unknown"}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {carSearchError && (
                        <p className="mt-1.5 text-xs text-rose-500">{carSearchError}</p>
                    )}
                </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Selected model">
                    <input
                        value={form.model_name}
                        readOnly
                        placeholder="—"
                        className={`${inputClass} cursor-default opacity-70`}
                    />
                </Field>

                <Field label="Seats" error={getFieldError("model.seats", "seats")}>
                    <input
                        type="number"
                        min="1"
                        max="9"
                        value={form.seats}
                        onChange={(e) => onFieldChange("seats", e.target.value)}
                        placeholder="e.g. 5"
                        disabled={form.delete_car}
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="License plate" error={getFieldError("carregistration", "license_plate")}>
                <input
                    value={form.license_plate}
                    onChange={(e) => onFieldChange("license_plate", e.target.value)}
                    placeholder="AB-123-CD"
                    disabled={form.delete_car}
                    className={`${inputClass} uppercase`}
                />
            </Field>

            {/* Color picker */}
            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Color
                </label>

                <div className="flex flex-wrap gap-2">
                    {DEFAULT_CAR_COLORS.map((color) => {
                        const selected = form.hex.toLowerCase() === color.hex.toLowerCase();
                        return (
                            <button
                                key={color.hex}
                                type="button"
                                onClick={() => onSelectColor(color.name, color.hex)}
                                disabled={form.delete_car}
                                title={color.name}
                                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border-2 transition ${
                                    selected
                                        ? "border-violet-500 shadow-md shadow-violet-200 scale-110"
                                        : "border-transparent hover:border-slate-300"
                                } disabled:opacity-40`}
                                style={{ backgroundColor: color.hex }}
                            >
                                {selected && (
                                    <span
                                        className="text-xs font-bold"
                                        style={{
                                            color: ["#FFFFFF", "#EAB308", "#C0C0C0"].includes(color.hex)
                                                ? "#374151"
                                                : "#fff",
                                        }}
                                    >
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={form.hex}
                        onChange={(e) => onCustomColorChange(e.target.value)}
                        disabled={form.delete_car}
                        className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 disabled:opacity-40"
                    />
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {form.color_name || "—"}
                    </div>
                </div>

                {getFieldError("color.name", "color_name") ? (
                    <p className="text-xs text-rose-500">{getFieldError("color.name", "color_name")}</p>
                ) : null}
                {getFieldError("color.hex_code", "hex", "hex_code") ? (
                    <p className="text-xs text-rose-500">{getFieldError("color.hex_code", "hex", "hex_code")}</p>
                ) : null}
            </div>

            {/* Delete toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 transition hover:bg-rose-50">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={form.delete_car}
                        onChange={(e) => onFieldChange("delete_car", e.target.checked)}
                        className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-rose-500" />
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">Remove my car</p>
                    <p className="text-xs text-slate-400">Unlink and delete car information</p>
                </div>
            </label>

            <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={saving}
                    className="rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40"
                >
                    {saving ? "Saving…" : form.delete_car ? "Remove car" : "Save car"}
                </button>
            </div>
        </form>
    );
}