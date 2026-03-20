type ApiErrorAlertProps = {
  message: string;
};

export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
  return (
    <div className="mb-4 rounded-xl border border-[#eee] bg-white px-4 py-3 text-sm text-[#222]">
      {message}
    </div>
  );
}
