export interface AppError {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    status?: number;
}