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
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Password policy: at least {policy.minLength} characters. Last reviewed{" "}
          {policy.lastUpdated}.
        </div>

        <ChangePasswordForm minLength={policy.minLength} />
      </div>
    </Card>
  );
}

export default PasswordSection;
