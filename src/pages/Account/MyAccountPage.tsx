import { useMyAccount } from "../../context/Account/UseMyAccount";
import { ProfileSection } from "../../components/ui/ProfileSection";
import { CarSection } from "../../components/ui/ProfileCarSection";

export default function MyAccountPage() {
    const account = useMyAccount();

    if (account.loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center rounded-[40px] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-4">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#f26f5a]" />
                    <p className="text-sm text-[#5d746b]">Loading your account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-0">
            <div className="overflow-hidden rounded-[40px] border border-[#efe2d4] bg-[linear-gradient(180deg,rgba(255,247,238,0.96),rgba(247,237,226,0.88))] px-5 py-6 shadow-[0_36px_90px_-50px_rgba(24,53,45,0.45)] sm:px-7 sm:py-8">
                <div className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b06f60]">My account</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#18352d] sm:text-5xl">Personal details and vehicle info, tuned to the same editorial rhythm.</h1>
                    <p className="mt-4 text-sm leading-6 text-[#4c655b] sm:text-base">Update your profile, keep your car recognizable, and manage settings from a warmer dashboard surface.</p>
                </div>

                <div className="mb-6 flex rounded-full border border-white/70 bg-white/60 p-1 backdrop-blur-xl">
                    {(["profile", "car"] as const).map((section) => (
                        <button
                            key={section}
                            type="button"
                            onClick={() => account.setActiveSection(section)}
                            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold capitalize transition-all ${
                                account.activeSection === section
                                    ? "bg-[#f26f5a] text-white shadow-[0_16px_34px_-18px_rgba(242,111,90,0.75)]"
                                    : "text-[#335246] hover:text-[#8c4d3f]"
                            }`}
                        >
                            {section === "car" ? "Car" : "Profile"}
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
