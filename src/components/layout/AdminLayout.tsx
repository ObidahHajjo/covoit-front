import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/Auth/useAuth";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminLayout() {
	const { logoutLocal } = useAuth();
	const location = useLocation();
	const { t } = useI18n();

	const menuItems = [
		{ path: "/admin", label: t("admin.dashboard"), exact: true },
		{ path: "/admin/users", label: t("admin.manageUsers") },
		{ path: "/admin/trips", label: t("admin.manageTrips") },
		{ path: "/admin/brands", label: t("admin.manageBrands") },
		{ path: "/admin/models", label: t("admin.manageModels") },
		{ path: "/admin/cars", label: t("admin.manageCars") },
	];

    const isActive = (path: string, exact: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight text-[var(--theme-coral)]">{t("admin.panel")}</h1>
                </div>
                <nav className="mt-4 flex flex-col gap-2 px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                isActive(item.path, item.exact || false)
                                    ? "bg-[var(--theme-coral)] text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
<h2 className="text-lg font-medium text-gray-800">{t("admin.area")}</h2>
		<div className="flex items-center gap-4">
		<LanguageSwitcher compact hideLabelOnMobile />
		<Link to="/home" className="text-sm font-medium text-gray-500 hover:text-gray-700">{t("admin.backToApp")}</Link>
		<button
		onClick={logoutLocal}
		className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
		>
		{t("admin.logout")}
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
