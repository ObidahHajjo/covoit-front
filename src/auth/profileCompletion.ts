import type { AuthUser } from "../types/MeResponse";

function hasText(value: string | null | undefined, minLength = 1): boolean {
  return typeof value === "string" && value.trim().length >= minLength;
}

export function isProfileComplete(user: AuthUser | null | undefined): boolean {
  const person = user?.person;

  if (!person) {
    return false;
  }

  return hasText(person.first_name, 2) && hasText(person.last_name, 2) && hasText(person.pseudo, 3);
}
