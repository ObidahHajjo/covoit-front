import type { AuthUser } from "../types/MeResponse";

/**
 * Returns whether a string contains at least the required trimmed length.
 *
 * @param value - String value to validate.
 * @param minLength - Minimum trimmed length required for the value.
 * @returns `true` when the value satisfies the minimum length requirement.
 */
function hasText(value: string | null | undefined, minLength = 1): boolean {
  return typeof value === "string" && value.trim().length >= minLength;
}

/**
 * Checks whether the authenticated user has completed the required profile fields.
 *
 * @param user - Authenticated user to validate.
 * @returns `true` when the required profile fields are populated.
 */
export function isProfileComplete(user: AuthUser | null | undefined): boolean {
  const person = user?.person;

  if (!person) {
    return false;
  }

  return hasText(person.first_name, 2) && hasText(person.last_name, 2) && hasText(person.pseudo, 3);
}
