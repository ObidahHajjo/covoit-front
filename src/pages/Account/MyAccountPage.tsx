import { useMyAccount } from "../../context/Account/UseMyAccount";
import { ProfileSection } from "../../components/ui/Account/ProfileSection.tsx";
import { CarSection } from "../../components/ui/Account/ProfileCarSection.tsx";
import PageLoadingState from "../../components/common/PageLoadingState";
import { useI18n } from "../../i18n/I18nProvider";

/**
 * Render the account management page where the user can update profile details and registered vehicle data.
 *
 * @returns The account settings interface or a loading state while account data is loading.
 */
export default function MyAccountPage() {
  const account = useMyAccount();
  const { t } = useI18n();

  if (account.loading) {
    return <PageLoadingState title={t("loading.account")} />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--theme-line)] bg-[var(--theme-bg-soft)] px-5 py-6 sm:px-7 sm:py-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-muted)]">{t("account.myAccount")}</p>
          <h1 className="mt-3 text-2xl font-medium leading-tight text-[var(--theme-ink)] sm:text-3xl">{t("account.heading")}</h1>
          <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-strong)] sm:text-base">{t("account.body")}</p>
        </div>

        <div className="mb-6 flex rounded-xl border border-[var(--theme-line)] bg-[var(--theme-surface)] p-1">
          {(["profile", "car"] as const).map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => account.setActiveSection(section)}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium capitalize transition-all ${
                account.activeSection === section
                  ? "bg-[var(--theme-primary)] text-white"
                  : "text-[var(--theme-muted-strong)] hover:text-[var(--theme-ink)]"
              }`}
            >
              {section === "car" ? t("common.car") : t("common.profile")}
            </button>
          ))}
        </div>

        {account.activeSection === "profile" ? (
          <ProfileSection
            person={account.person}
            form={account.profileForm}
            saving={account.profileSaving}
            success={account.profileSuccess}
            error={account.profileError}
            deleteAccountError={account.deleteAccountError}
            accountDeleting={account.accountDeleting}
            getFieldError={account.getFieldError}
            onFieldChange={account.updateProfileField}
            onSubmit={account.handleProfileSubmit}
            onReset={account.resetProfileForm}
            onDeleteAccount={account.handleDeleteAccount}
          />
        ) : (
          <CarSection
            form={account.carForm}
            brands={account.brands}
            saving={account.carSaving}
            success={account.carSuccess}
            error={account.carError}
            getFieldError={account.getFieldError}
            carSearch={account.carSearch}
            carSuggestions={account.carSuggestions}
            carSearchLoading={account.carSearchLoading}
            carSearchError={account.carSearchError}
            showCarDropdown={account.showCarDropdown}
            onFieldChange={account.updateCarField}
            onBrandChange={account.handleBrandChange}
            onCarSearchChange={account.handleCarSearchChange}
            onSelectSuggestion={account.handleSelectSuggestion}
            onSelectColor={account.handleSelectColor}
            onCustomColorChange={account.handleCustomColorChange}
            onSubmit={account.handleCarSubmit}
            onReset={account.resetCarForm}
          />
        )}
      </div>
    </div>
  );
}
