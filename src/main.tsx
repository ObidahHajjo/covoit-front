import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorProvider } from "./providers/ErrorProvider.tsx";
import { I18nProvider } from "./i18n/I18nProvider";

/**
 * Mounts the React application inside the DOM root element.
 *
 * @returns Does not return a value.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <ErrorProvider>
        <I18nProvider>
            <App/>
        </I18nProvider>
    </ErrorProvider>
);
