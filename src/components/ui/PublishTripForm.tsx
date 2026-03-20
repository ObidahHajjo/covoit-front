import type { FormEvent, ReactNode } from "react";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";
import type { AddressFieldState, SelectedAddress } from "../../context/Driver/usePublishTrip";

const inputClass =
  "w-full rounded-lg border border-[#eee] bg-white px-4 py-3 text-sm text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#222] focus:ring-1 focus:ring-[#222] disabled:cursor-not-allowed disabled:opacity-50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#666]">{label}</label>
      {children}
    </div>
  );
}

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
        <div key={label} className="rounded-lg border border-[#eee] bg-[#fafafa] px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[#888]">{label}</p>
          <p className="mt-1 truncate text-sm text-[#222]">{value}</p>
        </div>
      ))}
    </div>
  );
}

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
          <span className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#222] text-xs text-white">
            ✓
          </span>
        ) : null}

        {field.open && field.results.length > 0 ? (
          <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-[#eee] bg-white">
            {field.results.map((feature) => {
              const key = feature.properties.banId ?? feature.properties.id;
              return (
                <li key={key}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#222] transition hover:bg-[#fafafa]"
                    onMouseDown={() => onSelect(feature)}
                  >
                    <span className="shrink-0 text-[#888]">📍</span>
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

function FormSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#eee] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#eee] bg-[#fafafa] text-base">{icon}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#888]">Trip composer</p>
          <h2 className="text-lg font-medium text-[#222]">{title}</h2>
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
      {error ? (
        <div className="rounded-lg border border-[#eee] bg-[#fafafa] px-4 py-3.5 text-sm font-medium text-[#222] xl:col-span-2">
          {error}
        </div>
      ) : null}

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

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#eee] bg-[#fafafa] p-4 transition hover:bg-white">
          <div className="relative">
            <input
              type="checkbox"
              checked={smokingAllowed}
              onChange={(e) => onSmokingAllowedChange(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full border border-[#eee] bg-[#fafafa] transition peer-checked:bg-[#222]" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#222]">Smoking allowed</p>
            <p className="text-xs text-[#888]">Turn this on only if passengers may smoke during the ride.</p>
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
        className="w-full rounded-lg border border-[#222] bg-[#222] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-40 xl:col-span-2"
      >
        {submitting ? "Publishing..." : "Publish trip"}
      </button>
    </form>
  );
}
