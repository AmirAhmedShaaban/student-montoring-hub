import SectionCard from "./SectionCard";

function AddNoteForm({ value, categories, onChange, onSubmit }) {
  return (
    <SectionCard
      title="Add note"
      description="Capture a new staff note without leaving the profile page."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            value={value.category}
            onChange={(event) =>
              onChange((currentValue) => ({
                ...currentValue,
                category: event.target.value,
              }))
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Note</span>
          <textarea
            className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Write a concise follow-up note, observation, or next step."
            value={value.text}
            onChange={(event) =>
              onChange((currentValue) => ({
                ...currentValue,
                text: event.target.value,
              }))
            }
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          Add note
        </button>
      </form>
    </SectionCard>
  );
}

export default AddNoteForm;
