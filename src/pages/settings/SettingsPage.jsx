import { useEffect, useState } from "react";
import SettingsHeader from "./components/SettingsHeader";
import ProfileInfoSection from "./components/ProfileInfoSection";
import PasswordSection from "./components/PasswordSection";
import ProfilePictureSection from "./components/ProfilePictureSection";
import DeleteAccountSection from "./components/DeleteAccountSection";
import { getCurrentUser } from "../../services/currentUserService";
import { getAdminProfile } from "../../services/settingsService";

const LANGUAGE_OPTIONS = [
  { label: "English", value: 0 },
  { label: "Arabic", value: 1 },
];

function resolveLanguageValue(raw) {
  if (raw === 0 || raw === 1) return raw;
  const lower = String(raw).toLowerCase();
  if (lower === "english" || lower === "en") return 0;
  if (lower === "arabic" || lower === "ar") return 1;
  return 0;
}

function buildAccountMeta(profile) {
  return {
    status: profile ? "Active" : "Inactive",
    languageLabel:
      LANGUAGE_OPTIONS.find(
        (opt) => opt.value === resolveLanguageValue(profile?.language),
      )?.label ?? "English",
  };
}

function sessionToProfile(s) {
  return {
    fullname: s.name || "",
    email: s.email || "",
    role: s.role || "Teacher",
    language: "en",
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    profilePhotoPath: null, // Changed from profilePicture to profilePhotoPath
  };
}

function SettingsPage() {
  const session = getCurrentUser();
  const userId = session?.userId ?? null;

  const [profile, setProfile] = useState(() =>
    session ? sessionToProfile(session) : null,
  );
  const [loading, setLoading] = useState(true);
  const [profileUnavailable, setProfileUnavailable] = useState(false);

  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const res = await getAdminProfile();
      if (res.success) {
        setProfile(res.data);
        setProfileUnavailable(false);
      } else {
        setProfileUnavailable(true);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProfile().finally(() => setLoading(false));
  }, [userId]);

  const handleProfileUpdated = (updatedProfile) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }));
  };

  const accountMeta = buildAccountMeta(profile);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
          <p className="text-sm text-slate-500">Loading settings…</p>
        </div>
      </div>
    );
  }

  if (!profile && !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            No active session
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Please sign in to access your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <SettingsHeader account={accountMeta} />
      {profileUnavailable && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          <span className="font-semibold">Profile unavailable.</span> Your
          account profile has not been configured on the server yet.
        </div>
      )}
      <div className="space-y-6">
        <ProfilePictureSection
          currentPicture={profile?.profilePhotoPath ?? null} // Changed to profilePhotoPath
          userName={profile?.fullname || session?.name || ""}
          onPictureUpdated={fetchProfile}
        />
        <ProfileInfoSection
          key={profile?.fullname || "default"}
          profile={profile}
          languageOptions={LANGUAGE_OPTIONS}
          resolveLanguageValue={resolveLanguageValue}
          onProfileUpdated={handleProfileUpdated}
        />
        <PasswordSection />
        <DeleteAccountSection />
      </div>
    </div>
  );
}

export default SettingsPage;
