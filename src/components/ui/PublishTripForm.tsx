import type { FormEvent } from "react";
import type { GeoPfFeature } from "../../types/GeoPfSearchResponse";
import type { AddressFieldState, SelectedAddress } from "../../context/Driver/usePublishTrip";

// ── Shared input class ────────────────────────────────────────────────────────

const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50";

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
            </label>
            {children}
        </div>
    );
}

// ── AddressPreview ────────────────────────────────────────────────────────────

function AddressPreview({ selected }: { selected: SelectedAddress | null }) {
    if (!selected) return null;

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
                { label: "N°", value: selected.streetNumber || "—" },
                { label: "Street", value: selected.streetName || "—" },
                { label: "Postal", value: selected.postalCode || "—" },
                { label: "City", value: selected.cityName || "—" },
            ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700 truncate">{value}</p>
                </div>
            ))}
        </div>
    );
}

// ── AddressSearch ─────────────────────────────────────────────────────────────

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

                {field.selected && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                        ✓
                    </span>
                )}

                {field.open && field.results.length > 0 && (
                    <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                        {field.results.map((feature) => {
                            const key = feature.properties.banId ?? feature.properties.id;
                            return (
                                <li key={key}>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-violet-50"
                                        onMouseDown={() => onSelect(feature)}
                                    >
                                        <span className="text-slate-400 shrink-0">📍</span>
                                        <span className="text-sm text-slate-700">{feature.properties.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <AddressPreview selected={field.selected} />
        </div>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function FormSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4 sm:p-6">
            <div className="flex items-center gap-2">
                <span>{icon}</span>
                <h2 className="font-semibold text-slate-800">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ── PublishTripForm ───────────────────────────────────────────────────────────

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
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-xs">!</span>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
            )}

            {/* Trip info */}
            <FormSection icon="🕐" title="Trip information">
                <Field label="Date & time">
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

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={smokingAllowed}
                            onChange={(e) => onSmokingAllowedChange(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-violet-500" />
                        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Smoking allowed</p>
                        <p className="text-xs text-slate-400">Passengers may smoke during the trip</p>
                    </div>
                </label>
            </FormSection>

            {/* Starting address */}
            <FormSection icon="📍" title="Starting address">
                <AddressSearch
                    placeholder="Search starting address…"
                    field={starting}
                    onChange={onStartingChange}
                    onFocus={onStartingFocus}
                    onBlur={onStartingBlur}
                    onSelect={onSelectStarting}
                />
            </FormSection>

            {/* Arrival address */}
            <FormSection icon="🏁" title="Arrival address">
                <AddressSearch
                    placeholder="Search arrival address…"
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
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {submitting ? "Publishing…" : "Publish Trip"}
            </button>
        </form>
    );
}