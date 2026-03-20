import { useEffect, useState } from "react";
import { searchCommunes } from "../../../features/geo/geoApi.ts";
import type { CityPostalOption } from "../../../types/Commune.ts";

type CityAutocompleteProps = {
    label: string;
    placeholder: string;
    selectedOption: CityPostalOption | null;
    onSelect: (option: CityPostalOption | null) => void;
};

export default function CityAutocomplete({
                                             label,
                                             placeholder,
                                             selectedOption,
                                             onSelect,
                                         }: CityAutocompleteProps) {
    const [query, setQuery] = useState(selectedOption?.cityName ?? "");
    const [results, setResults] = useState<CityPostalOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setQuery(selectedOption?.cityName ?? "");
    }, [selectedOption]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            try {
                setIsLoading(true);
                const response = await searchCommunes(trimmedQuery);
                setResults(response);
                setIsOpen(response.length > 0);
            } catch {
                setResults([]);
                setIsOpen(false);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [query]);

    function handleChange(value: string): void {
        setQuery(value);
        setIsOpen(true);

        if (selectedOption && value !== selectedOption.cityName) {
            onSelect(null);
        }
    }

    function handleSelect(option: CityPostalOption): void {
        onSelect(option);
        setQuery(option.cityName);
        setResults([]);
        setIsOpen(false);
    }

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-semibold tracking-[0.04em] text-[var(--theme-ink)]">
                {label}
            </label>

            <input
                type="text"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => {
                    if (results.length > 0) {
                        setIsOpen(true);
                    }
                }}
                onBlur={() => {
                    window.setTimeout(() => {
                        setIsOpen(false);
                    }, 150);
                }}
                placeholder={placeholder}
                className="w-full rounded-[1.25rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.78)] px-4 py-3 text-[var(--theme-ink)] shadow-soft outline-none transition placeholder:text-[var(--theme-muted)]/80 focus:border-[rgba(255,122,89,0.38)] focus:bg-white focus:ring-4 focus:ring-[rgba(255,122,89,0.12)]"
                autoComplete="off"
            />

            {isLoading && (
                <p className="mt-2 text-sm text-[var(--theme-muted)]">Searching...</p>
            )}

            {!isLoading && isOpen && results.length > 0 && (
                <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-[1.5rem] border border-[var(--theme-line)] bg-[rgba(255,248,238,0.96)] p-2 shadow-warm backdrop-blur-xl">
                    {results.map((option) => {
                        const key = `${option.cityCode}-${option.postalCode}`;

                        return (
                            <li key={key}>
                                <button
                                    type="button"
                                    className="w-full rounded-[1rem] px-4 py-3 text-left transition hover:bg-white/80"
                                    onMouseDown={() => handleSelect(option)}
                                >
                                    <span className="font-semibold text-[var(--theme-ink)]">{option.cityName}</span>
                                    <span className="ml-2 text-sm text-[var(--theme-muted)]">
                                        {option.postalCode}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
