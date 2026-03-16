import './App.css'
import AppRouter from "./router/AppRouter";
import {LoadingProvider} from "./providers/LoadingProvider.tsx";
import {AxiosInterceptorProvider} from "./bootstrap.ts";
import GlobalSpinner from "./components/common/GlobalSpinner.tsx";
import GlobalErrorAlert from "./components/common/GlobalErrorAlert.tsx";
import {AuthProvider} from "./providers/AuthProvider.tsx";

export default function App() {
    return (
        <AuthProvider>
            <LoadingProvider>
                <AxiosInterceptorProvider/>
                <GlobalSpinner/>
                <GlobalErrorAlert />
                <AppRouter />
            </LoadingProvider>
        </AuthProvider>
    );
}
