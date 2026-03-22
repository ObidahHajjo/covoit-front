import "./App.css";
import GlobalErrorAlert from "./components/common/GlobalErrorAlert";
import GlobalSpinner from "./components/common/GlobalSpinner";
import { LoadingProvider } from "./providers/LoadingProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ChatInboxProvider } from "./providers/ChatInboxProvider";
import AppRouter from "./router/AppRouter";
import { AxiosInterceptorProvider } from "./bootstrap";

export default function App() {
  return (
    <LoadingProvider>
      <AxiosInterceptorProvider />
      <AuthProvider>
        <ChatInboxProvider>
          <GlobalSpinner />
          <GlobalErrorAlert />
          <AppRouter />
        </ChatInboxProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
