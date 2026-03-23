import type { FormEvent, ReactNode } from "react";
import type { Brand } from "../../../types/Brand.ts";
import type { Car } from "../../../types/Car.ts";
import type { CarFormState } from "../../../hooks/Account/UseMyAccount.ts";
import { DEFAULT_CAR_COLORS } from "../../../hooks/Account/UseMyAccount.ts";
import FloatingToast from "../../common/FloatingToast.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

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

/**
 * Pair a vehicle form control with its label and error.
 *
 * @param props - Component props for the field wrapper.
 * @param props.label - Visible field label.
 * @param props.error - Optional validation message shown below the field.
 * @param props.children - Form control rendered inside the field.
 * @returns The rendered field wrapper.
 */
function Field({ label, error, children }: { label: string; error?: string | null; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-[var(--theme-subtle)]">{error}</p> : null}
    </div>
  );
}

/**
 * Manage the driver's saved vehicle details.
 *
 * @param props - Component props for the vehicle-management form.
 * @param props.form - Current editable vehicle form state.
 * @param props.brands - Available car brands for the brand selector.
 * @param props.saving - Whether the save request is in progress.
 * @param props.success - Optional success message shown in a toast.
 * @param props.error - Optional error message shown in a toast.
 * @param props.getFieldError - Helper that returns a validation message for one or more field keys.
 * @param props.carSearch - Current free-text model search query.
 * @param props.carSuggestions - Suggested car matches returned from search.
 * @param props.carSearchLoading - Whether model suggestions are being loaded.
 * @param props.carSearchError - Optional error message for the model search area.
 * @param props.showCarDropdown - Whether the model suggestion dropdown is visible.
 * @param props.onFieldChange - Callback fired when a generic form field changes.
 * @param props.onBrandChange - Callback fired when the selected brand changes.
 * @param props.onCarSearchChange - Callback fired when the model search query changes.
 * @param props.onSelectSuggestion - Callback fired when a suggested car is chosen.
 * @param props.onSelectColor - Callback fired when a preset color is chosen.
 * @param props.onCustomColorChange - Callback fired when the custom color picker changes.
 * @param props.onSubmit - Form submit handler for saving or removing the car.
 * @param props.onReset - Callback fired when the form resets to its initial state.
 * @returns The rendered vehicle-management form.
 */
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
  const { t } = useI18n();
  const inputClass =
    "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[#ccc] focus:ring-2 focus:ring-[rgba(82,100,72,0.12)] disabled:cursor-not-allowed disabled:opacity-50";
  const hasCar = !form.delete_car && (form.brand_name || form.model_name);

  return (
    <form onSubmit={onSubmit} className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6 xl:space-y-0">
      <FloatingToast tone="success" message={success} durationMs={6500} />
      <FloatingToast tone="error" message={error} durationMs={6500} />
      <div className="space-y-5">
        <div className={`rounded-xl border p-5 ${form.delete_car ? "border-[var(--theme-line)] bg-[var(--theme-bg-soft)]" : "border-[var(--theme-line)] bg-[var(--theme-surface)]"}`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-2xl ${form.delete_car ? "bg-[var(--theme-bg-soft)] text-[var(--theme-subtle)]" : hasCar ? "bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]" : "bg-[var(--theme-bg-soft)] text-[var(--theme-muted)]"}`}>
              🚗
            </div>
            <div className="min-w-0 flex-1">
              {form.delete_car ? (
                <>
                  <p className="text-xl font-medium text-[var(--theme-ink)]">{t("car.carRemoved")}</p>
                  <p className="mt-1 text-sm text-[var(--theme-muted)]">{t("car.carRemovedBody")}</p>
                </>
              ) : hasCar ? (
                <>
                  <p className="truncate text-xl font-medium text-[var(--theme-ink)]">{form.brand_name} {form.model_name}</p>
                  <p className="mt-1 text-sm text-[var(--theme-muted)]">{form.seats ? t("car.seatsLabel", { count: form.seats }) : t("car.seatCountPending")}{form.license_plate ? ` - ${form.license_plate}` : ""}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-medium text-[var(--theme-ink)]">{t("car.noneYet")}</p>
                  <p className="mt-1 text-sm text-[var(--theme-muted)]">{t("car.noneYetBody")}</p>
                </>
              )}
            </div>
            {hasCar && !form.delete_car ? <div className="h-8 w-8 rounded-full border-2 border-[var(--theme-line)]" style={{ backgroundColor: form.hex }} /> : null}
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
          <Field label={t("car.brand")} error={getFieldError("brand.name", "brand_id")}>
            <select value={form.brand_name} onChange={(e) => onBrandChange(e.target.value)} disabled={form.delete_car} className={inputClass}>
              <option value="">{t("car.selectBrand")}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
          </Field>

          <Field label={t("car.modelSearch")} error={getFieldError("model.name", "model_name")}>
            <div className="relative">
              <input
                value={carSearch}
                onChange={(e) => onCarSearchChange(e.target.value)}
                placeholder={form.brand_name ? t("car.typeModel") : t("car.selectBrandFirst")}
                disabled={form.delete_car || !form.brand_name}
                className={inputClass}
              />
               {carSearchLoading ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--theme-muted)]">{t("common.searching")}</span> : null}
              {showCarDropdown ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)]">
                  {carSuggestions.map((car) => {
                    const brandName = car.model?.brand?.name ?? form.brand_name;
                     const modelName = car.model?.name ?? t("car.unknownModel");
                    return (
                      <button key={car.id} type="button" onClick={() => onSelectSuggestion(car)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--theme-bg-soft)]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-bg-soft)] text-sm">🚗</span>
                        <span>
                          <span className="block text-sm font-medium text-[var(--theme-ink)]">{brandName} {modelName}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {carSearchError ? <p className="mt-2 text-xs font-medium text-[var(--theme-subtle)]">{carSearchError}</p> : null}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("car.selectedModel")}>
              <input value={form.model_name} readOnly placeholder="-" className={`${inputClass} cursor-default opacity-70`} />
            </Field>

            <Field label={t("car.seats")} error={getFieldError("seats")}>
              <input type="number" min="1" max="9" value={form.seats} onChange={(e) => onFieldChange("seats", e.target.value)} placeholder={t("car.seatsPlaceholder")} disabled={form.delete_car} className={inputClass} />
            </Field>
          </div>

          <Field label={t("car.licensePlate")} error={getFieldError("carregistration", "license_plate")}>
            <input value={form.license_plate} onChange={(e) => onFieldChange("license_plate", e.target.value)} placeholder="AB-123-CD" disabled={form.delete_car} className={`${inputClass} uppercase`} />
          </Field>

          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("car.color")}</label>
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
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border-2 transition ${selected ? "scale-110 border-[var(--theme-primary)]" : "border-transparent hover:border-[var(--theme-line-strong)]"} disabled:opacity-40`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selected ? <span className="text-xs font-bold" style={{ color: ["#FFFFFF", "#EAB308", "#C0C0C0"].includes(color.hex) ? "#374151" : "#fff" }}>✓</span> : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <input type="color" value={form.hex} onChange={(e) => onCustomColorChange(e.target.value)} disabled={form.delete_car} className="h-11 w-16 cursor-pointer rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] p-1 disabled:opacity-40" />
              <div className="flex-1 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-ink)]">{form.color_name || "-"}</div>
            </div>

            {getFieldError("color.name", "color_name") ? <p className="text-xs font-medium text-[var(--theme-subtle)]">{getFieldError("color.name", "color_name")}</p> : null}
            {getFieldError("color.hex_code", "hex", "hex_code") ? <p className="text-xs font-medium text-[var(--theme-subtle)]">{getFieldError("color.hex_code", "hex", "hex_code")}</p> : null}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-4 transition hover:bg-[var(--theme-surface)]">
            <div className="relative">
              <input type="checkbox" checked={form.delete_car} onChange={(e) => onFieldChange("delete_car", e.target.checked)} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-[var(--theme-line)] transition peer-checked:bg-[var(--theme-muted)]" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--theme-surface)] transition peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--theme-ink)]">{t("car.removeMyCar")}</p>
              <p className="text-xs text-[var(--theme-muted)]">{t("car.removeMyCarBody")}</p>
            </div>
          </label>

          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            <button type="button" onClick={onReset} disabled={saving} className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3.5 text-sm font-medium text-[var(--theme-muted-strong)] transition hover:border-[var(--theme-line-strong)] hover:text-[var(--theme-ink)] disabled:opacity-40">{t("common.reset")}</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--theme-primary-dim)] disabled:opacity-40">{saving ? t("car.saving") : form.delete_car ? t("car.removeCar") : t("car.saveCar")}</button>
          </div>
        </div>
      </div>

      <div className="space-y-5 xl:sticky xl:top-8 xl:self-start">
        <div className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("car.vehicleNotes")}</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--theme-muted-strong)]">
            <p>{t("car.vehicleNotesBody1")}</p>
            <p>{t("car.vehicleNotesBody2")}</p>
          </div>
        </div>
      </div>
    </form>
  );
}
