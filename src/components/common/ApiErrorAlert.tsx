import { Notice } from "./SerenePrimitives";

type ApiErrorAlertProps = {
  message: string;
};

export default function ApiErrorAlert({ message }: ApiErrorAlertProps) {
  return <Notice tone="error" className="mb-4">{message}</Notice>;
}
