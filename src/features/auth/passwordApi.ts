import { apiClient } from "../../app/apiClient";
import { extractApiErrorMessage } from "../../app/apiError";

export type ForgotPasswordPayload = {
    email: string;
};

export type ResetPasswordPayload = {
    token: string;
    password: string;
    password_confirmation: string;
};

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    try {
        await apiClient.post("/auth/forgot-password", payload);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
    try {
        await apiClient.post("/auth/reset-password", payload);
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
}