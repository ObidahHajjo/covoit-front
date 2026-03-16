export interface AuthResponse  {
    access_token: string;
    token_type: string;
    expires_in: string;
    refresh_token: string;
    person_id: number;
    role_id: number;
}