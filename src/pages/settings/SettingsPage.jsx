import SettingsHeader from "./components/SettingsHeader";
import ProfileInfoSection from "./components/ProfileInfoSection";
import PasswordSection from "./components/PasswordSection";
import { settingsMockData } from "../../mocks/settings.mock";
import { useCurrentUserProfile } from "../../mocks/currentUser.mock";

function SettingsPage() {
  const currentUserProfile = useCurrentUserProfile();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SettingsHeader
        account={settingsMockData.account}
      />

      <div className="space-y-6">
        <ProfileInfoSection profile={currentUserProfile} />
        <PasswordSection policy={settingsMockData.passwordPolicy} />
      </div>
    </div>
  );
}

export default SettingsPage;
