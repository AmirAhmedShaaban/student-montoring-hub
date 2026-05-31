import { useState } from "react";
import {
  Button,
  Card,
  SectionHeader,
  SelectField,
  TextInput,
  ToggleSwitch,
} from "./SettingsUI";
import { updateAdminProfile } from "../../../services/settingsService";
import {
  refreshSession,
  updateProfile,
} from "../../../services/currentUserService";

function ProfileInfoSection({
  profile,
  userId,
  languageOptions,
  resolveLanguageValue,
  onProfileUpdated,
}) {
  // Fix: Removed unused useId calls

  // Fix: Initialize state directly from props.
  // Because we use a 'key' in the parent, this component remounts when profile changes.
  const [formData, setFormData] = useState({
    fullname: profile?.fullname || profile?.fullName || "",
    email: profile?.email || "",
    language: profile ? resolveLanguageValue(profile.language) : 0,
    emailNotificationsEnabled: profile?.emailNotificationsEnabled ?? true,
    pushNotificationsEnabled: profile?.pushNotificationsEnabled ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const avatarLabel =
    (profile?.fullname || profile?.fullName || "U")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const roleDisplay = profile?.role || "User";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      fullname: formData.fullname.trim(),
      language: formData.language,
      emailNotificationsEnabled: formData.emailNotificationsEnabled,
      pushNotificationsEnabled: formData.pushNotificationsEnabled,
    };

    const res = await updateAdminProfile(userId, payload);

    if (res.success) {
      const newName = formData.fullname.trim();

      if (res.data) {
        onProfileUpdated(res.data);
      }

      updateProfile({ name: newName });
      refreshSession();

      setMessage({ type: "success", text: res.message || "Profile saved." });
    } else {
      setMessage({
        type: "error",
        text: res.message || "Failed to save profile.",
      });
    }

    setSaving(false);
  };

  return (
    <Card>
      <SectionHeader
        title="Profile information"
        description="Keep your staff identity details accurate for communication."
      />

      <div className="flex items-center gap-4 pt-5">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-600 text-lg font-semibold text-white shadow-sm"
          aria-hidden="true"
        >
          {avatarLabel}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">
            {profile?.fullname || profile?.fullName || "—"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{roleDisplay}</p>
        </div>
      </div>

      <form className="pt-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="fullname"
            label="Full name"
            value={formData.fullname}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, fullname: event.target.value }))
            }
            autoComplete="name"
            required
          />

          <TextInput
            id="email"
            label="Email address"
            type="email"
            value={formData.email}
            disabled
            description="Email is managed by your account and cannot be changed here."
            autoComplete="email"
          />

          <SelectField
            id="language"
            label="Language"
            value={formData.language}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                language: Number(event.target.value),
              }))
            }
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <div
              id="role"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
            >
              {roleDisplay}
            </div>
          </div>

          <div className="sm:col-span-2 space-y-3">
            <ToggleSwitch
              id="email-notifications"
              label="Email notifications"
              description="Receive intervention alerts and weekly summaries by email."
              checked={formData.emailNotificationsEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emailNotificationsEnabled: e.target.checked,
                }))
              }
            />
            <ToggleSwitch
              id="push-notifications"
              label="Push notifications"
              description="Receive real-time alerts while using the dashboard."
              checked={formData.pushNotificationsEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pushNotificationsEnabled: e.target.checked,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
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
            {message?.text || "Update your staff contact details here."}
          </p>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ProfileInfoSection;
