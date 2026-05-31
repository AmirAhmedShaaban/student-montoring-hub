import { useId, useState } from "react";
import { Button, PasswordInput } from "./SettingsUI";
import { changeUserPassword } from "../../../services/settingsService";

const MIN_PASSWORD_LENGTH = 8;

function ChangePasswordForm({ userId }) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }

  const passwordsMatch =
    formData.newPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (formData.newPassword.length < MIN_PASSWORD_LENGTH) {
      setMessage({
        type: "error",
        text: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setSaving(true);

    const res = await changeUserPassword(userId, {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Password updated." });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({
        type: "error",
        text: res.message || "Failed to update password.",
      });
    }

    setSaving(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PasswordInput
        id={currentPasswordId}
        label="Current password"
        value={formData.currentPassword}
        onChange={(event) =>
          setFormData((prev) => ({
            ...prev,
            currentPassword: event.target.value,
          }))
        }
        autoComplete="current-password"
        required
      />

      <PasswordInput
        id={newPasswordId}
        label="New password"
        description={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
        value={formData.newPassword}
        onChange={(event) =>
          setFormData((prev) => ({
            ...prev,
            newPassword: event.target.value,
          }))
        }
        autoComplete="new-password"
        required
      />

      <PasswordInput
        id={confirmPasswordId}
        label="Confirm new password"
        value={formData.confirmPassword}
        onChange={(event) =>
          setFormData((prev) => ({
            ...prev,
            confirmPassword: event.target.value,
          }))
        }
        autoComplete="new-password"
        required
        error={
          formData.confirmPassword.length > 0 && !passwordsMatch
            ? "Passwords must match."
            : undefined
        }
      />

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm leading-6 ${
            message?.type === "error"
              ? "text-rose-600 font-medium"
              : message?.type === "success"
                ? "text-emerald-600 font-medium"
                : "text-slate-500"
          }`}
          aria-live="polite"
        >
          {message?.text ||
            "Keep this password private and avoid using the same one on other systems."}
        </p>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
