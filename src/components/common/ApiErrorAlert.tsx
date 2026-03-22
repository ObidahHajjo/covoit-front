import { Notice } from "./SerenePrimitives";

type ApiErrorAlertProps = {
  message: string;
};

/**
 * Show a compact API error notice.
 *
 * @param props - Component props containing the API error message to display.
 * @param props.message - Error text shown inside the notice.
 * @returns The rendered error notice.
 */
export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
  return <Notice tone="error" className="mb-4">{message}</Notice>;
}
