import { Card, SectionHeader } from "./SettingsUI";
import ChangePasswordForm from "./ChangePasswordForm";

function PasswordSection({ userId }) {
  return (
    <Card>
      <SectionHeader
        title="Password"
        description="Update your password regularly to keep dashboard access secure."
      />

      <div className="pt-5">
        <ChangePasswordForm userId={userId} />
      </div>
    </Card>
  );
}

export default PasswordSection;
