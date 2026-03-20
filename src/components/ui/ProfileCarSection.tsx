import type { FormEvent, ReactNode } from "react";
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

function Field({ label, error, children }: { label: string; error?: string | null; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">{label}</label>
            {children}
            {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
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
        "w-full rounded-[20px] border border-[#e5d8c8] bg-white px-4 py-3.5 text-sm text-[#18352d] outline-none transition placeholder:text-[#8ea198] focus:border-[#f3b8ab] focus:ring-4 focus:ring-[#f7d7cf] disabled:cursor-not-allowed disabled:opacity-50";
    const hasCar = !form.delete_car && (form.brand_name || form.model_name);

    return (
        <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
            <div className="space-y-5">
                {success ? <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700">{success}</div> : null}
                {error ? <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-700">{error}</div> : null}

                <div className={`rounded-[28px] border p-5 ${form.delete_car ? "border-rose-200 bg-rose-50/80" : "border-white/70 bg-white/70"} shadow-[0_20px_52px_-34px_rgba(24,53,45,0.3)] backdrop-blur-xl`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] text-2xl ${form.delete_car ? "bg-rose-100 text-rose-400" : hasCar ? "bg-gradient-to-br from-[#f26f5a] to-[#de8f62] text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]" : "bg-[#f7ede2] text-[#b06f60]"}`}>
                            🚗
                        </div>
                        <div className="min-w-0 flex-1">
                            {form.delete_car ? (
                                <>
                                    <p className="font-serif text-2xl text-rose-700">Car will be removed</p>
                                    <p className="mt-1 text-sm text-rose-600">Saving now will unlink this vehicle from your profile.</p>
                                </>
                            ) : hasCar ? (
                                <>
                                    <p className="truncate font-serif text-2xl text-[#18352d]">{form.brand_name} {form.model_name}</p>
                                    <p className="mt-1 text-sm text-[#5d746b]">{form.seats ? `${form.seats} seats` : "Seat count pending"}{form.license_plate ? ` - ${form.license_plate}` : ""}</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-serif text-2xl text-[#18352d]">No car registered yet</p>
                                    <p className="mt-1 text-sm text-[#5d746b]">Add your vehicle so passengers can recognize it quickly.</p>
                                </>
                            )}
                        </div>
                        {hasCar && !form.delete_car ? <div className="h-8 w-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: form.hex }} /> : null}
                    </div>
                </div>

                <div className="grid gap-4 rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_24px_64px_-40px_rgba(24,53,45,0.35)] backdrop-blur-xl sm:p-6">
                    <Field label="Brand" error={getFieldError("brand.name", "brand_id")}>
                        <select value={form.brand_name} onChange={(e) => onBrandChange(e.target.value)} disabled={form.delete_car} className={inputClass}>
                            <option value="">Select a brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.name}>{brand.name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Model search" error={getFieldError("model.name", "model_name")}>
                        <div className="relative">
                            <input
                                value={carSearch}
                                onChange={(e) => onCarSearchChange(e.target.value)}
                                placeholder={form.brand_name ? "Type a model name..." : "Select a brand first"}
                                disabled={form.delete_car || !form.brand_name}
                                className={inputClass}
                            />
                            {carSearchLoading ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#5d746b]">Searching...</span> : null}
                            {showCarDropdown ? (
                                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_30px_70px_-36px_rgba(24,53,45,0.36)] backdrop-blur-xl">
                                    {carSuggestions.map((car) => {
                                        const brandName = car.model?.brand?.name ?? form.brand_name;
                                        const modelName = car.model?.name ?? "Unknown model";
                                        const seats = car.model?.seats ?? null;
                                        return (
                                            <button key={car.id} type="button" onClick={() => onSelectSuggestion(car)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#fff3ec]">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] bg-[#f7ede2] text-sm">🚗</span>
                                                <span>
                                                    <span className="block text-sm font-semibold text-[#18352d]">{brandName} {modelName}</span>
                                                    <span className="text-xs text-[#5d746b]">{seats ? `${seats} seats` : "Seats unknown"}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : null}
                            {carSearchError ? <p className="mt-2 text-xs font-medium text-rose-600">{carSearchError}</p> : null}
                        </div>
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Selected model">
                            <input value={form.model_name} readOnly placeholder="-" className={`${inputClass} cursor-default opacity-70`} />
                        </Field>

                        <Field label="Seats" error={getFieldError("model.seats", "seats")}>
                            <input type="number" min="1" max="9" value={form.seats} onChange={(e) => onFieldChange("seats", e.target.value)} placeholder="e.g. 5" disabled={form.delete_car} className={inputClass} />
                        </Field>
                    </div>

                    <Field label="License plate" error={getFieldError("carregistration", "license_plate")}>
                        <input value={form.license_plate} onChange={(e) => onFieldChange("license_plate", e.target.value)} placeholder="AB-123-CD" disabled={form.delete_car} className={`${inputClass} uppercase`} />
                    </Field>

                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Color</label>
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
                                        className={`relative flex h-10 w-10 items-center justify-center rounded-[16px] border-2 transition ${selected ? "scale-110 border-[#f26f5a] shadow-[0_16px_28px_-20px_rgba(242,111,90,0.75)]" : "border-transparent hover:border-[#d8cfc2]"} disabled:opacity-40`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {selected ? <span className="text-xs font-bold" style={{ color: ["#FFFFFF", "#EAB308", "#C0C0C0"].includes(color.hex) ? "#374151" : "#fff" }}>✓</span> : null}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3">
                            <input type="color" value={form.hex} onChange={(e) => onCustomColorChange(e.target.value)} disabled={form.delete_car} className="h-11 w-16 cursor-pointer rounded-[16px] border border-[#e5d8c8] bg-white p-1 disabled:opacity-40" />
                            <div className="flex-1 rounded-[20px] border border-[#e5d8c8] bg-white px-4 py-3 text-sm text-[#335246]">{form.color_name || "-"}</div>
                        </div>

                        {getFieldError("color.name", "color_name") ? <p className="text-xs font-medium text-rose-600">{getFieldError("color.name", "color_name")}</p> : null}
                        {getFieldError("color.hex_code", "hex", "hex_code") ? <p className="text-xs font-medium text-rose-600">{getFieldError("color.hex_code", "hex", "hex_code")}</p> : null}
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50/80 p-4 transition hover:bg-rose-50">
                        <div className="relative">
                            <input type="checkbox" checked={form.delete_car} onChange={(e) => onFieldChange("delete_car", e.target.checked)} className="peer sr-only" />
                            <div className="h-6 w-11 rounded-full bg-[#e6ddd2] transition peer-checked:bg-rose-500" />
                            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#18352d]">Remove my car</p>
                            <p className="text-xs text-[#5d746b]">Unlink and delete vehicle information from your account.</p>
                        </div>
                    </label>

                    <div className="grid gap-3 pt-1 sm:grid-cols-2">
                        <button type="button" onClick={onReset} disabled={saving} className="rounded-full border border-[#d8cfc2] bg-[#fff9f4] px-4 py-3.5 text-sm font-semibold text-[#335246] transition hover:border-[#f3b8ab] hover:text-[#8c4d3f] disabled:opacity-40">Reset</button>
                        <button type="submit" disabled={saving} className="rounded-full bg-[#f26f5a] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(242,111,90,0.75)] transition hover:bg-[#e4604b] disabled:opacity-40">{saving ? "Saving..." : form.delete_car ? "Remove car" : "Save car"}</button>
                    </div>
                </div>
            </div>

            <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[30px] border border-white/70 bg-white/60 p-5 shadow-[0_24px_64px_-40px_rgba(24,53,45,0.35)] backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b06f60]">Vehicle notes</p>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-[#4c655b]">
                        <p>Choose the most precise model you can so seats and recognition details stay accurate.</p>
                        <p>The saved color and license plate help passengers find you faster at pickup.</p>
                    </div>
                </div>
            </div>
        </form>
    );
}
