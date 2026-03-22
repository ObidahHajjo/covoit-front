/**
 * Authentication request payload types.
 */

/** Credentials payload used for login and registration. */
export interface AuthRequest {
    email: string;
    password: string;
    password_confirmation: string|null;
}
