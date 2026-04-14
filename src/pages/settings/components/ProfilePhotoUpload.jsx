import { useId, useState } from "react";
import { Card, SectionHeader } from "./SettingsUI";

function ProfilePhotoUpload({ profile }) {
  const inputId = useId();
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (event) => {
    const [file] = event.target.files ?? [];
    setSelectedFileName(file ? file.name : "");
  };

  return (
    <Card>
      <SectionHeader
        title="Profile photo"
        description="Upload a new avatar to keep staff profiles recognizable in the dashboard."
      />

      <div className="space-y-5 pt-5">
        <div className="flex items-center gap-4">
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

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Upload a new photo
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                PNG or JPG, up to 2 MB. Clear headshots work best for review and
                communication screens.
              </p>
            </div>

            <div className="shrink-0">
              <input
                id={inputId}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-within:ring-4 focus-within:ring-sky-500/10"
              >
                Change photo
              </label>
            </div>
          </div>

          <p
            className="mt-4 text-sm leading-6 text-slate-600"
            aria-live="polite"
          >
            {selectedFileName
              ? `Selected file: ${selectedFileName}`
              : "No file selected yet."}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default ProfilePhotoUpload;
