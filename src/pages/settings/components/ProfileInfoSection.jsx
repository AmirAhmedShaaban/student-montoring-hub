import { useEffect, useId, useState } from "react";
import { Button, Card, SectionHeader, TextInput } from "./SettingsUI";
import { updateProfile } from "../../../services/currentUserService";

function ProfileInfoSection({ profile }) {
  const fullNameId = useId();
  const emailId = useId();
  const roleId = useId();

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
    });
  }, [profile.fullName, profile.email]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      name: formData.fullName,
      email: formData.email,
    });
    setMessage("Profile changes saved in the local state.");
  };

  return (
    <Card>
      <SectionHeader
        title="Profile information"
        description="Keep your staff identity details accurate for communication."
      />

      <div className="flex items-center gap-4 pt-5">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl text-lg font-semibold text-white shadow-sm ${profile.avatarColor}`}
          aria-hidden="true"
        >
          {profile.avatarLabel}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950">
            {profile.fullName}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {profile.role}
          </p>
        </div>
      </div>

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
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500" aria-live="polite">
              {message || "Update your staff contact details here."}
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
