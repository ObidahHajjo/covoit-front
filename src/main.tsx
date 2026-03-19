import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorProvider } from "./app/ErrorProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ErrorProvider>
        <App/>
    </ErrorProvider>
);