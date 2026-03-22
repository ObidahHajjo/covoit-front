import "./App.css";
import GlobalErrorAlert from "./components/common/GlobalErrorAlert";
import GlobalSpinner from "./components/common/GlobalSpinner";
import { LoadingProvider } from "./providers/LoadingProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ChatInboxProvider } from "./providers/ChatInboxProvider";
import AppRouter from "./router/AppRouter";
import { AxiosInterceptorProvider } from "./bootstrap";

/**
 * Renders the root application shell with all shared providers and the router.
 *
 * @returns The top-level React application tree.
 */
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
