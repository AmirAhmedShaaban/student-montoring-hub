import BehaviorFormField from "./BehaviorFormField";
import ToggleField from "./ToggleField";

function BehaviorRuleForm({
  value,
  categories,
  severityOptions,
  onChange,
  onSubmit,
  onToggleStatus,
  saving = false,
}) {
  const handleChange = (field) => (event) => {
    onChange({ ...value, [field]: event.target.value });
  };

  /**
   * Toggle changes go through onToggleStatus (if provided) so the parent
   * can fire the dedicated PATCH endpoint immediately. Falls back to a
   * plain onChange if no onToggleStatus is given.
   */
  const handleToggleChange = (checked) => {
    if (onToggleStatus) {
      onToggleStatus(checked);
    } else {
      onChange({ ...value, isActive: checked });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <BehaviorFormField
          id="rule-name"
          label="Rule name"
          hint="Use a concise title that staff can scan quickly."
        >
          {({ describedBy }) => (
            <input
              id="rule-name"
              name="name"
              type="text"
              value={value.name}
              onChange={handleChange("name")}
              required
              aria-describedby={describedBy}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="Class disruption"
            />
          )}
        </BehaviorFormField>

        <BehaviorFormField
          id="rule-category"
          label="Category"
          hint="Group related behaviors for reporting and review."
        >
          {({ describedBy }) => (
            <select
              id="rule-category"
              name="category"
              value={value.category}
              onChange={handleChange("category")}
              required
              aria-describedby={describedBy}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </BehaviorFormField>

        <BehaviorFormField
          id="rule-severity"
          label="Severity"
          hint="Match the response level to the risk or disruption."
        >
          {({ describedBy }) => (
            <select
              id="rule-severity"
              name="severity"
              value={value.severity}
              onChange={handleChange("severity")}
              required
              aria-describedby={describedBy}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </BehaviorFormField>

        <ToggleField
          id="rule-status"
          label="Active status"
          checked={value.isActive}
          onChange={handleToggleChange}
          hint="Inactive rules stay saved but do not appear in active interventions."
        />
      </div>

      <BehaviorFormField
        id="rule-description"
        label="Description"
        hint="Explain the behavior in plain language for consistent staff use."
      >
        {({ describedBy }) => (
          <textarea
            id="rule-description"
            name="description"
            value={value.description}
            onChange={handleChange("description")}
            rows={4}
            aria-describedby={describedBy}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Students talking over the teacher during class time."
          />
        )}
      </BehaviorFormField>

      <BehaviorFormField
        id="rule-consequences"
        label="Consequences"
        hint="Add the expected response, intervention, or follow-up action (stored locally, not sent to the server)."
      >
        {({ describedBy }) => (
          <textarea
            id="rule-consequences"
            name="consequences"
            value={value.consequences}
            onChange={handleChange("consequences")}
            rows={4}
            aria-describedby={describedBy}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Warning, parent contact, and documentation."
          />
        )}
      </BehaviorFormField>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">
          Keep the form tight and specific so staff can apply it consistently.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save rule"}
        </button>
      </div>
    </form>
  );
}

export default BehaviorRuleForm;
