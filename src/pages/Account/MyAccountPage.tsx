import { useMyAccount } from "../../context/Account/UseMyAccount";
import { ProfileSection } from "../../components/ui/ProfileSection";
import { CarSection } from "../../components/ui/ProfileCarSection";

export default function MyAccountPage() {
    const account = useMyAccount();

    if (account.loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-500" />
                    <p className="text-sm text-slate-400">Loading your account…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg space-y-6 px-4 py-6 sm:px-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Account</h1>
                <p className="mt-1 text-sm text-slate-400">Manage your profile and vehicle</p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
                {(["profile", "car"] as const).map((section) => (
                    <button
                        key={section}
                        type="button"
                        onClick={() => account.setActiveSection(section)}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                            account.activeSection === section
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {section === "car" ? "🚗 Car" : "👤 Profile"}
                    </button>
                ))}
            </div>

            {/* Content card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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