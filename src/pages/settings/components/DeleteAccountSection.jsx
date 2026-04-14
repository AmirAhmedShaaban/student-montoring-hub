import { useId, useState } from "react";
import { Button, Card, SectionHeader, TextInput } from "./SettingsUI";

function DeleteAccountSection({ account }) {
  const confirmId = useId();
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const canDelete = confirmation.trim().toUpperCase() === "DELETE";

  const handleDelete = (event) => {
    event.preventDefault();

    if (!canDelete) {
      setMessage("Type DELETE to enable the account removal action.");
      return;
    }

    setMessage("Delete request captured in the local demo state.");
    setConfirmation("");
  };

  return (
    <Card className="border-rose-200 bg-linear-to-br from-rose-50 to-white">
      <SectionHeader
        title="Delete account"
        description="Use this only when an account must be retired permanently."
      />

      <form className="pt-5" onSubmit={handleDelete}>
        <div className="rounded-3xl border border-rose-200 bg-white p-4">
          <p className="text-sm font-semibold text-rose-700">Warning</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This action removes the demo account connection for the{" "}
            {account.status.toLowerCase()} profile created in {account.joinedOn}
            . In a live system, this would require administrator confirmation
            and audit logging.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <TextInput
            id={confirmId}
            label="Type DELETE to confirm"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="DELETE"
            description="Confirmation text is required before the button becomes active."
          />

          <div className="flex flex-col gap-3 border-t border-rose-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500" aria-live="polite">
              {message ||
                "This action should only be used after review by an administrator."}
            </p>
            <Button type="submit" variant="danger" disabled={!canDelete}>
              Delete account
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

export default DeleteAccountSection;
