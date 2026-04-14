import { Card, Button, Input, TextArea } from "./HelpUI";

function SupportTicketCard({
  title,
  description,
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  onSubmit,
  subjectLabel,
  subjectPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitLabel,
  confirmation,
  note,
}) {
  return (
    <Card id="support-ticket" title={title} description={description}>
      <form className="space-y-5" onSubmit={onSubmit}>
        <Input
          id="support-subject"
          label={subjectLabel}
          value={subject}
          onChange={onSubjectChange}
          placeholder={subjectPlaceholder}
          required
        />

        <TextArea
          id="support-message"
          label={messageLabel}
          value={message}
          onChange={onMessageChange}
          placeholder={messagePlaceholder}
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" className="sm:min-w-56">
            {submitLabel}
          </Button>
          {note ? (
            <p className="text-sm leading-6 text-slate-500">{note}</p>
          ) : null}
        </div>

        {confirmation ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            {confirmation}
          </p>
        ) : null}
      </form>
    </Card>
  );
}

export default SupportTicketCard;
