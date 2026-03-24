import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/Auth/useAuth";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminLayout() {
  const { logoutLocal } = useAuth();
  const location = useLocation();
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <h1 className="text-lg font-bold tracking-tight text-[var(--theme-coral)]">{t("admin.panel")}</h1>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label={t("admin.closeSidebar")}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="hidden p-6 lg:block">
          <h1 className="text-xl font-bold tracking-tight text-[var(--theme-coral)]">{t("admin.panel")}</h1>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3 py-4 lg:mt-4 lg:gap-2 lg:px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
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

        <div className="mt-auto border-t p-4 lg:hidden">
          <Link
            to="/home"
            onClick={closeSidebar}
            className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            {t("admin.backToApp")}
          </Link>
          <button
            onClick={logoutLocal}
            className="mt-2 w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            {t("admin.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-8 lg:h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              aria-label={t("admin.openSidebar")}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base font-medium text-gray-800 lg:text-lg">{t("admin.area")}</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <LanguageSwitcher compact hideLabelOnMobile />
            <Link to="/home" className="hidden text-sm font-medium text-gray-500 hover:text-gray-700 sm:block">
              {t("admin.backToApp")}
            </Link>
            <button
              onClick={logoutLocal}
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 lg:px-4 lg:py-2 lg:text-sm"
            >
              {t("admin.logout")}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
