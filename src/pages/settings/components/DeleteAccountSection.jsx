import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, SectionHeader } from "./SettingsUI";
import { deleteAccount } from "../../../services/settingsService";
import { logout } from "../../../services/authService";

function DeleteAccountSection({ userId }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDelete = async () => {
    if (!userId) return;
    setDeleting(true);
    setMessage(null);

    const res = await deleteAccount(userId);
    if (res.success) {
      await logout();
      navigate("/login", { replace: true });
    } else {
      setMessage({
        type: "error",
        text: res.message || "Could not delete account.",
      });
      setShowConfirm(false);
    }
    setDeleting(false);
  };

  return (
    <Card className="border-rose-200">
      <SectionHeader
        title="Danger zone"
        description="Permanently delete your account and all associated data."
      />

      <div className="pt-5 space-y-4">
        {!showConfirm ? (
          <Button variant="danger" onClick={() => setShowConfirm(true)}>
            Delete my account
          </Button>
        ) : (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-3">
            <p className="text-sm font-medium text-rose-800">
              Are you absolutely sure? This action cannot be undone. All your
              data will be permanently removed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
    </Card>
  );
}

export default DeleteAccountSection;
