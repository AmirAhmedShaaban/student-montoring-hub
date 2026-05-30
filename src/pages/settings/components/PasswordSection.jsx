import { Card, SectionHeader } from "./SettingsUI";
import ChangePasswordForm from "./ChangePasswordForm";

function PasswordSection({ policy }) {
  return (
    <Card>
      <SectionHeader
        title="Password"
        description="Update your password regularly to keep dashboard access secure."
      />

      <div className="pt-5">
        <ChangePasswordForm minLength={policy.minLength} />
      </div>
    </Card>
  );
}

export default PasswordSection;
