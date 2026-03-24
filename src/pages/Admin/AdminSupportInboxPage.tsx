import { useNavigate } from "react-router-dom";
import { useAdminSupportInbox } from "../../hooks/Admin/useAdminSupportInbox";
import { AdminSupportSessionCard } from "../../components/ui/Admin/Support/AdminSupportSessionCard";
import { useI18n } from "../../i18n/I18nProvider";

export default function AdminSupportInboxPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const {
    waitingSessions,
    activeSessions,
    activeTab,
    setActiveTab,
    loading,
    error,
    handleJoinSession,
  } = useAdminSupportInbox();

  const handleJoin = async (sessionId: number) => {
    await handleJoinSession(sessionId);
    navigate(`/admin/support/${sessionId}`);
  };

  const handleSelect = (sessionId: number) => {
    navigate(`/admin/support/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--theme-coral)] border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">{t("admin.loadingSessions")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">{t("admin.supportChat")}</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["waiting", "active"] as const).map((tab) => {
          const count = tab === "waiting" ? waitingSessions.length : activeSessions.length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 text-sm font-medium transition ${activeTab === tab
                  ? "border-b-2 border-[var(--theme-coral)] text-[var(--theme-coral)]"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab === "waiting" ? t("admin.waitingSessions") : t("admin.activeSessions")}
              {count > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--theme-coral)] px-1.5 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {activeTab === "waiting" && (
          <>
            {waitingSessions.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                <p className="text-sm text-gray-400">{t("admin.noWaitingSessions")}</p>
              </div>
            ) : (
              waitingSessions.map((session) => (
                <AdminSupportSessionCard
                  key={session.id}
                  session={session}
                  onJoin={handleJoin}
                  onSelect={handleSelect}
                />
              ))
            )}
          </>
        )}

        {activeTab === "active" && (
          <>
            {activeSessions.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                <p className="text-sm text-gray-400">{t("admin.noActiveSessions")}</p>
              </div>
            ) : (
              activeSessions.map((session) => (
                <AdminSupportSessionCard
                  key={session.id}
                  session={session}
                  onSelect={handleSelect}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
