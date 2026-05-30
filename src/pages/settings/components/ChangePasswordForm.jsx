import { useId, useState } from "react";
import { Button, PasswordInput } from "./SettingsUI";
import { changePassword } from "../../../services/currentUserService";

function ChangePasswordForm({ minLength }) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const passwordsMatch =
    formData.newPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.newPassword.length < minLength) {
      setMessage(`New password must be at least ${minLength} characters long.`);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    const result = changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    setMessage(result.message);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <PasswordInput
        id={currentPasswordId}
        label="Current password"
        value={formData.currentPassword}
        onChange={(event) =>
          setFormData((current) => ({
            ...current,
            currentPassword: event.target.value,
          }))
        }
        autoComplete="current-password"
        required
      />

      <PasswordInput
        id={newPasswordId}
        label="New password"
        description={`Use at least ${minLength} characters.`}
        value={formData.newPassword}
        onChange={(event) =>
          setFormData((current) => ({
            ...current,
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
          setFormData((current) => ({
            ...current,
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
        <p className="text-sm leading-6 text-slate-500" aria-live="polite">
          {message ||
            "Keep this password private and avoid using the same one on other systems."}
        </p>
        <Button type="submit" variant="primary">
          Update password
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
