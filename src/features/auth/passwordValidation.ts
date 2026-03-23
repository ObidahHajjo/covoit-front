export type PasswordValidationResult = {
  isLengthValid: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
  isValid: boolean;
};

const PASSWORD_SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;

/**
 * Validates a password against the shared account security rules.
 *
 * @param password - Password value to validate.
 * @returns Detailed validation flags plus the combined validity result.
 */
export function validatePassword(password: string): PasswordValidationResult {
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = PASSWORD_SPECIAL_CHARACTER_REGEX.test(password);

  return {
    isLengthValid,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialCharacter,
    isValid: isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter,
  };
}
