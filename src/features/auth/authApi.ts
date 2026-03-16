import { apiClient } from "../../app/apiClient";
import type { ApiResponse } from "../../types/ApiResponse";
import type { AuthResponse } from "../../types/AuthResponse.ts";
import type { AuthRequest } from "../../types/AuthRequest.ts";
import { extractApiErrorMessage } from "../../app/apiError";
import type {AuthUser} from "../../types/MeResponse.ts";

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

export async function getMe(): Promise<AuthUser> {
    try {
        const { data } = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function register(payload: AuthRequest): Promise<AuthResponse> {
    try {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function logout(): Promise<AuthResponse> {
    try {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/logout");
        return data.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}