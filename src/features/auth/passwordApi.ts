import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";

/**
 * Payload used to start the password reset flow.
 */
export type ForgotPasswordPayload = {
  email: string;
};

/**
 * Payload used to complete the password reset flow.
 */
export type ResetPasswordPayload = {
  token: string;
  password: string;
  password_confirmation: string;
};

/**
 * Payload used to change the password for an authenticated user.
 */
export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

/**
 * Requests a password reset link for the provided email address.
 *
 * @param payload Email address that should receive the reset instructions.
 * @returns A promise that resolves when the reset email request completes successfully.
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  try {
    await apiClient.post("/auth/forgot-password", payload);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Resets a password by submitting a valid reset token and the new password.
 *
 * @param payload Reset token and replacement password values accepted by the API.
 * @returns A promise that resolves when the password has been updated successfully.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  try {
    await apiClient.post("/auth/reset-password", payload);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Changes the password for the currently authenticated user.
 *
 * @param payload Current and replacement password values accepted by the API.
 * @returns A promise that resolves when the password has been updated successfully.
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  try {
    await apiClient.post("/auth/change-password", payload);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
