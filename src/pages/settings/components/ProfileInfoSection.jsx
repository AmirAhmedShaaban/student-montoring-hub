import { useId, useState } from "react";
import {
  Button,
  Card,
  SectionHeader,
  SelectField,
  TextInput,
  ToggleSwitch,
} from "./SettingsUI";

function ProfileInfoSection({ profile, preferences }) {
  const fullNameId = useId();
  const emailId = useId();
  const roleId = useId();
  const languageId = useId();
  const emailNotificationsId = useId();
  const pushNotificationsId = useId();
  const darkModeId = useId();

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    language: preferences.language,
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    darkMode: preferences.darkMode,
  });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Profile changes saved in the local demo state.");
  };

  return (
    <Card>
      <SectionHeader
        title="Profile information"
        description="Keep your name, email, and account preferences accurate for staff communication."
      />

      <form className="pt-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id={fullNameId}
            label="Full name"
            value={formData.fullName}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            autoComplete="name"
          />

          <TextInput
            id={emailId}
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            autoComplete="email"
          />

          <div className="space-y-2">
            <label
              htmlFor={roleId}
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <div
              id={roleId}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
            >
              {profile.role}
            </div>
          </div>

          <SelectField
            id={languageId}
            label="Language"
            value={formData.language}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                language: event.target.value,
              }))
            }
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Arabic</option>
          </SelectField>
        </div>

        <fieldset className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-800">
            Notification and appearance preferences
          </legend>

          <div className="mt-3 grid gap-3">
            <ToggleSwitch
              id={emailNotificationsId}
              label="Email notifications"
              description="Receive behavior summaries and follow-up reminders by email."
              checked={formData.emailNotifications}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  emailNotifications: event.target.checked,
                }))
              }
            />

            <ToggleSwitch
              id={pushNotificationsId}
              label="Push notifications"
              description="Show browser notifications for urgent student interventions."
              checked={formData.pushNotifications}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  pushNotifications: event.target.checked,
                }))
              }
            />

            <ToggleSwitch
              id={darkModeId}
              label="Dark mode"
              description="Theme placeholder for future interface customization."
              checked={formData.darkMode}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  darkMode: event.target.checked,
                }))
              }
            />
          </div>
        </fieldset>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500" aria-live="polite">
            {message || `Notifications follow ${formData.language}.`}
          </p>
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ProfileInfoSection;
