import { apiClient } from "../../app/apiClient";
import type { ApiResponse } from "../../types/ApiResponse";
import type { AuthRequest } from "../../types/AuthRequest.ts";
import { extractApiErrorMessage } from "../../app/apiError";
import type { AuthUser } from "../../types/MeResponse.ts";

/**
 * Authenticates a user and establishes the session via cookies.
 *
 * @param payload Credentials and confirmation data sent to the authentication endpoint.
 * @returns Nothing when the login succeeds.
 */
export async function login(payload: AuthRequest): Promise<void> {
  try {
    await apiClient.post<ApiResponse<{ message: string }>>("/auth/login", payload);
  } catch (error) {
    const errorMsg = extractApiErrorMessage(error);
    if (errorMsg === "Invalid credentials.") {
      throw new Error("Incorrect username or password");
    }
    throw new Error(errorMsg);
  }
}

/**
 * Fetches the profile of the currently authenticated user.
 *
 * @returns The authenticated user record resolved from the `/auth/me` endpoint.
 */
export async function getMe(): Promise<AuthUser> {
  try {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>("/auth/me", {
      showGlobalLoader: false,
    });
    return data.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Creates a new account and opens the session via cookies.
 *
 * @param payload Registration credentials submitted for account creation.
 * @returns Nothing when registration succeeds.
 */
export async function register(payload: AuthRequest): Promise<void> {
  try {
    await apiClient.post<ApiResponse<{ message: string }>>("/auth/register", payload);
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}

/**
 * Ends the current authenticated session on the backend.
 *
 * @returns Nothing when the logout succeeds.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post<ApiResponse<{ message: string }>>("/auth/logout");
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  }
}
