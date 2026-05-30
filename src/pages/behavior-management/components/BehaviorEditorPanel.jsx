import BehaviorRuleForm from "./BehaviorRuleForm";

const severityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

function BehaviorEditorPanel({
  rule,
  categories,
  onChange,
  onSubmit,
  onCreateRule,
  onDeleteRule,
  onToggleStatus,
  saving = false,
  saveMessage = null,
  onClearMessage,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      {/* ---- header ---- */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Intervention guidance
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {rule?.name?.trim() ? rule.name : "Select an intervention rule"}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {rule
              ? "Review the incident response, severity, and active state."
              : "Choose a rule to review the intervention response."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCreateRule}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Add rule
          </button>

          {rule && onDeleteRule && (
            <button
              type="button"
              onClick={() => onDeleteRule(rule.id)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Delete rule
            </button>
          )}
        </div>
      </div>

      {/* ---- body ---- */}
      {rule ? (
        <div className="mt-6 space-y-6">
          {/* read-only summary cards */}
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Category
              </dt>
              <dd className="mt-2 text-sm font-semibold text-slate-950">
                {rule.category || "—"}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Severity
              </dt>
              <dd className="mt-2 text-sm font-semibold text-slate-950">
                {rule.severity || "—"}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </dt>
              <dd className="mt-2 text-sm font-semibold text-slate-950">
                {rule.isActive ? "Active" : "Inactive"}
              </dd>
            </div>
          </dl>

          {/* editable form */}
          <BehaviorRuleForm
            value={rule}
            categories={categories}
            severityOptions={severityOptions}
            onChange={onChange}
            onSubmit={onSubmit}
            onToggleStatus={onToggleStatus}
            saving={saving}
          />

          {/* save feedback message */}
          {saveMessage && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${
                saveMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="flex-1">{saveMessage.text}</span>
              {onClearMessage && (
                <button
                  type="button"
                  onClick={onClearMessage}
                  className="text-current opacity-60 hover:opacity-100 focus:outline-none"
                  aria-label="Dismiss message"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-sm leading-6 text-slate-600">
          Select a rule from the list to review the incident response.
        </div>
      )}
    </section>
  );
}

export default BehaviorEditorPanel;
