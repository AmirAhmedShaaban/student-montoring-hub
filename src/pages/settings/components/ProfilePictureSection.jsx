import { useId, useRef, useState } from "react";
import { Button, Card, SectionHeader } from "./SettingsUI";
import {
  uploadProfilePicture,
  deleteProfilePicture,
} from "../../../services/settingsService";

function ProfilePictureSection({
  userId,
  currentPicture,
  userName,
  onPictureUpdated,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("Picture", file);

    const res = await uploadProfilePicture(userId, formData);

    if (res.success) {
      onPictureUpdated(
        res.data?.profilePicture ?? res.data?.url ?? currentPicture,
      );
      setMessage({ type: "success", text: "Picture updated." });
    } else {
      setMessage({ type: "error", text: res.message || "Upload failed." });
    }

    setUploading(false);
    // Clear input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (!userId) return;
    setRemoving(true);
    setMessage(null);

    const res = await deleteProfilePicture(userId);
    if (res.success) {
      onPictureUpdated(null);
      setMessage({ type: "success", text: "Picture removed." });
    } else {
      setMessage({
        type: "error",
        text: res.message || "Could not remove picture.",
      });
    }

    setRemoving(false);
  };

  const initials =
    (userName || "U")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  return (
    <Card>
      <SectionHeader
        title="Profile picture"
        description="Upload a photo or avatar for your account."
      />

      <div className="pt-5 flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          {currentPicture ? (
            <img
              src={currentPicture}
              alt="Profile"
              className="h-20 w-20 rounded-3xl object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-600 text-xl font-semibold text-white shadow-sm">
              {initials}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profile-picture-upload"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>

            {currentPicture && (
              <Button
                variant="danger"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? "Removing…" : "Remove photo"}
              </Button>
            )}
          </div>

          <p className="text-sm text-slate-500">JPEG, PNG or GIF. 2 MB max.</p>

          {message && (
            <p
              className={`text-sm font-medium ${
                message.type === "error" ? "text-rose-600" : "text-emerald-600"
              }`}
              aria-live="polite"
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ProfilePictureSection;
