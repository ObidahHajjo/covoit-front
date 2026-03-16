type ApiErrorAlertProps = {
    message: string;
};

export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
    return (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
        </div>
    );
}