import SectionCard from "./SectionCard";
import { formatDate } from "../studentProfile.utils";

function NotesPanel({ notes }) {
  if (!notes || !notes.length) {
    return (
      <SectionCard
        title="Notes panel"
        description="Staff notes are captured here for follow-up and support planning."
      >
        <p className="text-sm text-slate-600">No notes have been added yet.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Notes panel"
      description="Staff notes are captured here for follow-up and support planning."
    >
      <ul className="space-y-4" aria-label="Student notes">
        {notes.map((note) => (
          <li
            key={note.id || note.noteID}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {note.category || note.noteType}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {note.text || note.noteText}
                </p>
              </div>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {note.author || "Staff"}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {formatDate(note.timestamp || note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export default NotesPanel;
