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
      <label className="mb-2 block text-sm font-medium text-[#222]">
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
        className="w-full rounded-lg border border-[#eee] bg-white px-4 py-3 text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#222]"
        autoComplete="off"
      />

      {isLoading && (
        <p className="mt-2 text-sm text-[#888]">Searching...</p>
      )}

      {!isLoading && isOpen && results.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-[#eee] bg-white p-2">
          {results.map((option) => {
            const key = `${option.cityCode}-${option.postalCode}`;

            return (
              <li key={key}>
                <button
                  type="button"
                  className="w-full rounded px-4 py-3 text-left transition hover:bg-[#fafafa]"
                  onMouseDown={() => handleSelect(option)}
                >
                  <span className="font-medium text-[#222]">{option.cityName}</span>
                  <span className="ml-2 text-sm text-[#888]">
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
