import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorProvider } from "./app/ErrorProvider";

/**
 * Mounts the React application inside the DOM root element.
 *
 * @returns Does not return a value.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <ErrorProvider>
        <App/>
    </ErrorProvider>
);
