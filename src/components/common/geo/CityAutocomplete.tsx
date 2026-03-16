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
            <label className="mb-1 block text-sm font-medium text-slate-700">
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
                className="w-full rounded-xl border px-4 py-3"
                autoComplete="off"
            />

            {isLoading && (
                <p className="mt-1 text-sm text-slate-500">Searching...</p>
            )}

            {!isLoading && isOpen && results.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                    {results.map((option) => {
                        const key = `${option.cityCode}-${option.postalCode}`;

                        return (
                            <li key={key}>
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 text-left hover:bg-slate-100"
                                    onMouseDown={() => handleSelect(option)}
                                >
                                    <span className="font-medium">{option.cityName}</span>
                                    <span className="ml-2 text-sm text-slate-500">
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