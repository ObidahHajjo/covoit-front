import "./App.css";
import GlobalErrorAlert from "./components/common/GlobalErrorAlert";
import GlobalSpinner from "./components/common/GlobalSpinner";
import { LoadingProvider } from "./providers/LoadingProvider";
import { AuthProvider } from "./providers/AuthProvider";
import AppRouter from "./router/AppRouter";
import { AxiosInterceptorProvider } from "./bootstrap";

export default function App() {
  return (
    <LoadingProvider>
      <AxiosInterceptorProvider />
      <AuthProvider>
        <GlobalSpinner />
        <GlobalErrorAlert />
        <AppRouter />
      </AuthProvider>
    </LoadingProvider>
  );
}
