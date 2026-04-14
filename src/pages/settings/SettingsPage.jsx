import SettingsHeader from "./components/SettingsHeader";
import ProfileInfoSection from "./components/ProfileInfoSection";
import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import PasswordSection from "./components/PasswordSection";
import DeleteAccountSection from "./components/DeleteAccountSection";
import { settingsMockData } from "../../mocks/settings.mock";

function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SettingsHeader
        account={settingsMockData.account}
        preferences={settingsMockData.preferences}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <ProfileInfoSection
            profile={settingsMockData.profile}
            preferences={settingsMockData.preferences}
          />
          <PasswordSection policy={settingsMockData.passwordPolicy} />
        </div>

        <div className="space-y-6">
          <ProfilePhotoUpload profile={settingsMockData.profile} />
          <DeleteAccountSection account={settingsMockData.account} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
