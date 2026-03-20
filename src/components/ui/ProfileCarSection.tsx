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
      <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-[#999]">{error}</p> : null}
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
    "w-full rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#ccc] focus:ring-2 focus:ring-[#eee] disabled:cursor-not-allowed disabled:opacity-50";
  const hasCar = !form.delete_car && (form.brand_name || form.model_name);

  return (
    <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
      <div className="space-y-5">
        {success ? <div className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666]">{success}</div> : null}
        {error ? <div className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666]">{error}</div> : null}

        <div className={`rounded-xl border p-5 ${form.delete_car ? "border-[#eee] bg-[#fafafa]" : "border-[#eee] bg-white"}`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-2xl ${form.delete_car ? "bg-[#fafafa] text-[#999]" : hasCar ? "bg-[#fafafa] text-[#888]" : "bg-[#fafafa] text-[#888]"}`}>
              🚗
            </div>
            <div className="min-w-0 flex-1">
              {form.delete_car ? (
                <>
                  <p className="text-xl font-medium text-[#222]">Car will be removed</p>
                  <p className="mt-1 text-sm text-[#888]">Saving now will unlink this vehicle from your profile.</p>
                </>
              ) : hasCar ? (
                <>
                  <p className="truncate text-xl font-medium text-[#222]">{form.brand_name} {form.model_name}</p>
                  <p className="mt-1 text-sm text-[#888]">{form.seats ? `${form.seats} seats` : "Seat count pending"}{form.license_plate ? ` - ${form.license_plate}` : ""}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-medium text-[#222]">No car registered yet</p>
                  <p className="mt-1 text-sm text-[#888]">Add your vehicle so passengers can recognize it quickly.</p>
                </>
              )}
            </div>
            {hasCar && !form.delete_car ? <div className="h-8 w-8 rounded-full border-2 border-[#eee]" style={{ backgroundColor: form.hex }} /> : null}
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[#eee] bg-white p-5 sm:p-6">
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
              {carSearchLoading ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#888]">Searching...</span> : null}
              {showCarDropdown ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-[#eee] bg-white">
                  {carSuggestions.map((car) => {
                    const brandName = car.model?.brand?.name ?? form.brand_name;
                    const modelName = car.model?.name ?? "Unknown model";
                    const seats = car.model?.seats ?? null;
                    return (
                      <button key={car.id} type="button" onClick={() => onSelectSuggestion(car)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#fafafa]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] text-sm">🚗</span>
                        <span>
                          <span className="block text-sm font-medium text-[#222]">{brandName} {modelName}</span>
                          <span className="text-xs text-[#888]">{seats ? `${seats} seats` : "Seats unknown"}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {carSearchError ? <p className="mt-2 text-xs font-medium text-[#999]">{carSearchError}</p> : null}
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
            <label className="block text-xs font-medium uppercase tracking-wide text-[#888]">Color</label>
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
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border-2 transition ${selected ? "scale-110 border-[#222]" : "border-transparent hover:border-[#ddd]"} disabled:opacity-40`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selected ? <span className="text-xs font-bold" style={{ color: ["#FFFFFF", "#EAB308", "#C0C0C0"].includes(color.hex) ? "#374151" : "#fff" }}>✓</span> : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <input type="color" value={form.hex} onChange={(e) => onCustomColorChange(e.target.value)} disabled={form.delete_car} className="h-11 w-16 cursor-pointer rounded-lg border border-[#eee] bg-white p-1 disabled:opacity-40" />
              <div className="flex-1 rounded-lg border border-[#eee] bg-white px-4 py-3 text-sm text-[#222]">{form.color_name || "-"}</div>
            </div>

            {getFieldError("color.name", "color_name") ? <p className="text-xs font-medium text-[#999]">{getFieldError("color.name", "color_name")}</p> : null}
            {getFieldError("color.hex_code", "hex", "hex_code") ? <p className="text-xs font-medium text-[#999]">{getFieldError("color.hex_code", "hex", "hex_code")}</p> : null}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#eee] bg-[#fafafa] p-4 transition hover:bg-white">
            <div className="relative">
              <input type="checkbox" checked={form.delete_car} onChange={(e) => onFieldChange("delete_car", e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[#eee] transition peer-checked:bg-[#888]" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#222]">Remove my car</p>
              <p className="text-xs text-[#888]">Unlink and delete vehicle information from your account.</p>
            </div>
          </label>

          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            <button type="button" onClick={onReset} disabled={saving} className="rounded-lg border border-[#eee] bg-white px-4 py-3.5 text-sm font-medium text-[#666] transition hover:border-[#ccc] hover:text-[#222] disabled:opacity-40">Reset</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#333] disabled:opacity-40">{saving ? "Saving..." : form.delete_car ? "Remove car" : "Save car"}</button>
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
        <div className="rounded-xl border border-[#eee] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#888]">Vehicle notes</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-[#666]">
            <p>Choose the most precise model you can so seats and recognition details stay accurate.</p>
            <p>The saved color and license plate help passengers find you faster at pickup.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
