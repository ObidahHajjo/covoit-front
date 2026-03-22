import { useEffect, useState } from "react";
import { searchCommunes } from "../../../features/geo/geoApi.ts";
import type { CityPostalOption } from "../../../types/Commune.ts";
import { FormField } from "../SerenePrimitives.tsx";
import { useI18n } from "../../../i18n/I18nProvider.tsx";

type CityAutocompleteProps = {
  label: string;
  placeholder: string;
  selectedOption: CityPostalOption | null;
  onSelect: (option: CityPostalOption | null) => void;
};

/**
 * Autocomplete French city and postal-code selections.
 *
 * @param props - Component props controlling the autocomplete field state.
 * @param props.label - Visible label for the field.
 * @param props.placeholder - Placeholder text shown in the text input.
 * @param props.selectedOption - Currently selected city option, if any.
 * @param props.onSelect - Callback fired when a city option is chosen or cleared.
 * @returns The rendered city autocomplete field.
 */
export default function CityAutocomplete({
  label,
  placeholder,
  selectedOption,
  onSelect,
}: CityAutocompleteProps) {
  const { t } = useI18n();
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

  /**
   * Update the query and clear the selected city when the typed value diverges.
   *
   * @param value - Current raw input value from the text field.
   * @returns Nothing.
   */
  function handleChange(value: string): void {
    setQuery(value);
    setIsOpen(true);

    if (selectedOption && value !== selectedOption.cityName) {
      onSelect(null);
    }
  }

  /**
   * Apply a chosen autocomplete option and close the results list.
   *
   * @param option - City and postal-code option selected by the user.
   * @returns Nothing.
   */
  function handleSelect(option: CityPostalOption): void {
    onSelect(option);
    setQuery(option.cityName);
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <FormField label={label}>
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
            // Delay closing so option clicks fired on mouse down can complete before blur hides the list.
            window.setTimeout(() => {
              setIsOpen(false);
            }, 150);
          }}
          placeholder={placeholder}
          className="serene-input"
          autoComplete="off"
        />
      </FormField>

      {isLoading && (
        <p className="mt-2 text-sm text-[var(--theme-muted)]">{t("common.searching")}</p>
      )}

      {!isLoading && isOpen && results.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-[1.25rem] border border-[var(--theme-line)] bg-[rgba(255,255,255,0.96)] p-2 shadow-[var(--theme-shadow-float)] backdrop-blur-xl">
          {results.map((option) => {
            const key = `${option.cityCode}-${option.postalCode}`;

            return (
              <li key={key}>
                <button
                  type="button"
                  className="w-full rounded-[1rem] px-4 py-3 text-left transition hover:bg-[var(--theme-bg-soft)]"
                  onMouseDown={() => handleSelect(option)}
                >
                  <span className="font-medium text-[var(--theme-ink)]">{option.cityName}</span>
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
