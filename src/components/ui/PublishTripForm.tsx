import type { FormEvent, ReactNode } from "react";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";
import type { AddressFieldState, SelectedAddress } from "../../context/Driver/usePublishTrip";
import FloatingToast from "../common/FloatingToast";

const inputClass =
  "w-full rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-ink)] outline-none transition placeholder:text-[var(--theme-subtle)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[rgba(82,100,72,0.16)] disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Wrap a publish-trip form control with its label.
 *
 * @param props - Component props for the field wrapper.
 * @param props.label - Visible field label.
 * @param props.children - Form control rendered inside the wrapper.
 * @returns The rendered field wrapper.
 */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wider text-[var(--theme-muted-strong)]">{label}</label>
      {children}
    </div>
  );
}

/**
 * Show the selected address details after search.
 *
 * @param props - Component props for the selected-address preview.
 * @param props.selected - Normalized selected address, or `null` when none is chosen.
 * @returns The rendered selected-address preview, or `null` when no address is selected.
 */
function AddressPreview({ selected }: { selected: SelectedAddress | null }) {
  if (!selected) return null;

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "No.", value: selected.streetNumber || "-" },
        { label: "Street", value: selected.streetName || "-" },
        { label: "Postal", value: selected.postalCode || "-" },
        { label: "City", value: selected.cityName || "-" },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">{label}</p>
          <p className="mt-1 truncate text-sm text-[var(--theme-ink)]">{value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Provide searchable address selection for one trip endpoint.
 *
 * @param props - Component props for one address search input.
 * @param props.placeholder - Placeholder text shown in the search field.
 * @param props.field - Full address field state, including query, results, and selection.
 * @param props.onChange - Callback fired when the search query changes.
 * @param props.onFocus - Callback fired when the input gains focus.
 * @param props.onBlur - Callback fired when the input loses focus.
 * @param props.onSelect - Callback fired when a search result is chosen.
 * @returns The rendered searchable address input and preview.
 */
function AddressSearch({
  placeholder,
  field,
  onChange,
  onFocus,
  onBlur,
  onSelect,
}: {
  placeholder: string;
  field: AddressFieldState;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: (feature: GeoPfFeature) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={field.query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClass}
        />

        {field.selected ? (
          <span className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--theme-primary)] text-xs text-white">
            ✓
          </span>
        ) : null}

        {field.open && field.results.length > 0 ? (
          <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-[var(--theme-line)] bg-[var(--theme-surface)]">
            {field.results.map((feature) => {
              const key = feature.properties.banId ?? feature.properties.id;
              return (
                <li key={key}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[var(--theme-ink)] transition hover:bg-[var(--theme-bg-soft)]"
                    onMouseDown={() => onSelect(feature)}
                  >
                    <span className="shrink-0 text-[var(--theme-muted)]">📍</span>
                    <span>{feature.properties.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <AddressPreview selected={field.selected} />
    </div>
  );
}

/**
 * Group publish-trip inputs into titled sections.
 *
 * @param props - Component props for the titled form section.
 * @param props.icon - Icon shown beside the section title.
 * @param props.title - Section title.
 * @param props.children - Inputs rendered inside the section.
 * @returns The rendered form section.
 */
function FormSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] text-base">{icon}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-muted)]">Trip composer</p>
          <h2 className="text-lg font-medium text-[var(--theme-ink)]">{title}</h2>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

type Props = {
  tripDateTime: string;
  availableSeats: string;
  smokingAllowed: boolean;
  error: string | null;
  submitting: boolean;
  isSubmitDisabled: boolean;
  starting: AddressFieldState;
  arrival: AddressFieldState;
  onTripDateTimeChange: (v: string) => void;
  onAvailableSeatsChange: (v: string) => void;
  onSmokingAllowedChange: (v: boolean) => void;
  onStartingChange: (v: string) => void;
  onArrivalChange: (v: string) => void;
  onStartingFocus: () => void;
  onStartingBlur: () => void;
  onArrivalFocus: () => void;
  onArrivalBlur: () => void;
  onSelectStarting: (f: GeoPfFeature) => void;
  onSelectArrival: (f: GeoPfFeature) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

/**
 * Collect the inputs required to publish a new trip.
 *
 * @param props - Component props for the publish-trip form.
 * @param props.tripDateTime - Current departure date-time value.
 * @param props.availableSeats - Current available-seat value.
 * @param props.smokingAllowed - Whether smoking is allowed on the trip.
 * @param props.error - Optional error message shown in a toast.
 * @param props.submitting - Whether the publish request is in progress.
 * @param props.isSubmitDisabled - Whether the publish button should be disabled.
 * @param props.starting - Search state for the starting address field.
 * @param props.arrival - Search state for the arrival address field.
 * @param props.onTripDateTimeChange - Callback fired when the departure date-time changes.
 * @param props.onAvailableSeatsChange - Callback fired when the available-seat value changes.
 * @param props.onSmokingAllowedChange - Callback fired when smoking permission changes.
 * @param props.onStartingChange - Callback fired when the starting-address query changes.
 * @param props.onArrivalChange - Callback fired when the arrival-address query changes.
 * @param props.onStartingFocus - Callback fired when the starting field gains focus.
 * @param props.onStartingBlur - Callback fired when the starting field loses focus.
 * @param props.onArrivalFocus - Callback fired when the arrival field gains focus.
 * @param props.onArrivalBlur - Callback fired when the arrival field loses focus.
 * @param props.onSelectStarting - Callback fired when a starting-address result is chosen.
 * @param props.onSelectArrival - Callback fired when an arrival-address result is chosen.
 * @param props.onSubmit - Form submit handler for publishing the trip.
 * @returns The rendered publish-trip form.
 */
export function PublishTripForm({
  tripDateTime,
  availableSeats,
  smokingAllowed,
  error,
  submitting,
  isSubmitDisabled,
  starting,
  arrival,
  onTripDateTimeChange,
  onAvailableSeatsChange,
  onSmokingAllowedChange,
  onStartingChange,
  onArrivalChange,
  onStartingFocus,
  onStartingBlur,
  onArrivalFocus,
  onArrivalBlur,
  onSelectStarting,
  onSelectArrival,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 xl:grid xl:grid-cols-2 xl:gap-6 xl:space-y-0">
      <FloatingToast tone="error" message={error} durationMs={6500} />

      <FormSection icon="🕐" title="Trip information">
        <Field label="Date and time">
          <input
            type="datetime-local"
            value={tripDateTime}
            onChange={(e) => onTripDateTimeChange(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Available seats">
          <input
            type="number"
            min="1"
            max="9"
            value={availableSeats}
            onChange={(e) => onAvailableSeatsChange(e.target.value)}
            placeholder="e.g. 3"
            className={inputClass}
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] p-4 transition hover:bg-[var(--theme-surface)]">
          <div className="relative">
            <input
              type="checkbox"
              checked={smokingAllowed}
              onChange={(e) => onSmokingAllowedChange(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] transition peer-checked:bg-[var(--theme-primary)]" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--theme-surface)] transition peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--theme-ink)]">Smoking allowed</p>
            <p className="text-xs text-[var(--theme-muted)]">Turn this on only if passengers may smoke during the ride.</p>
          </div>
        </label>
      </FormSection>

      <FormSection icon="📍" title="Starting address">
        <AddressSearch
          placeholder="Search starting address..."
          field={starting}
          onChange={onStartingChange}
          onFocus={onStartingFocus}
          onBlur={onStartingBlur}
          onSelect={onSelectStarting}
        />
      </FormSection>

      <FormSection icon="🏁" title="Arrival address">
        <AddressSearch
          placeholder="Search arrival address..."
          field={arrival}
          onChange={onArrivalChange}
          onFocus={onArrivalFocus}
          onBlur={onArrivalBlur}
          onSelect={onSelectArrival}
        />
      </FormSection>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-lg border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-40 xl:col-span-2"
      >
        {submitting ? "Publishing..." : "Publish trip"}
      </button>
    </form>
  );
}
