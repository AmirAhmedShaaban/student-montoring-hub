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
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Editor panel
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {rule?.name?.trim() ? rule.name : "Create a behavior rule"}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            {rule
              ? "Adjust the rule details, severity, and active state without leaving the page."
              : "Start a new rule, then use the form to define how the school should respond."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateRule}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          New rule
        </button>
      </div>

      {rule ? (
        <div className="mt-6 space-y-6">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Category
              </dt>
              <dd className="mt-2 text-sm font-semibold text-slate-950">
                {rule.category}
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Severity
              </dt>
              <dd className="mt-2 text-sm font-semibold text-slate-950">
                {rule.severity}
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

          <BehaviorRuleForm
            value={rule}
            categories={categories}
            severityOptions={severityOptions}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-sm leading-6 text-slate-600">
          Select a rule from the list or create a new one to begin editing.
        </div>
      )}
    </section>
  );
}

export default BehaviorEditorPanel;
