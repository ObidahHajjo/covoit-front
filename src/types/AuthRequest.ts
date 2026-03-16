export interface AuthRequest {
    email: string;
    password: string;
    password_confirmation: string|null;
}