import { apiClient } from "../../app/apiClient";
import type { ApiResponse } from "../../types/ApiResponse";
import type { AuthResponse } from "../../types/AuthResponse.ts";
import type { AuthRequest } from "../../types/AuthRequest.ts";
import { extractApiErrorMessage } from "../../app/apiError";
import type {AuthUser} from "../../types/MeResponse.ts";

/**
 * Authenticates a user and returns the issued access and refresh tokens.
 *
 * @param payload Credentials and confirmation data sent to the authentication endpoint.
 * @returns The authentication payload returned by the API for the newly opened session.
 */
export async function login(payload: AuthRequest): Promise<AuthResponse> {
    try {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
        return data.data;
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
        const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me',  {
            showGlobalLoader: false
        });
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Creates a new account and returns the issued authentication tokens.
 *
 * @param payload Registration credentials submitted for account creation.
 * @returns The authentication payload returned for the newly registered account.
 */
export async function register(payload: AuthRequest): Promise<AuthResponse> {
    try {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

/**
 * Ends the current authenticated session on the backend.
 *
 * @returns The API response payload returned after the logout request succeeds.
 */
export async function logout(): Promise<AuthResponse> {
    try {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/logout");
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}
