type ApiErrorAlertProps = {
    message: string;
};

export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
    return (
        <div className="mb-4 rounded-[1.5rem] border border-[rgba(235,90,54,0.22)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,122,89,0.14))] px-4 py-3 text-sm text-[var(--theme-ink)] shadow-soft backdrop-blur-sm">
            {message}
        </div>
    );
}
