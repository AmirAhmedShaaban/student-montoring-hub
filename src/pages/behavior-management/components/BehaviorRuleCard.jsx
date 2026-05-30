const severityStyles = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  High: "bg-rose-50 text-rose-700 ring-rose-100",
};

function BehaviorRuleCard({ rule, active, onSelect }) {
  const severityClass = severityStyles[rule.severity] || severityStyles.Medium;

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(rule.id)}
        aria-pressed={active}
        className={`group w-full rounded-3xl border p-5 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          active
            ? "border-sky-300 bg-sky-50/70"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-950">
              {rule.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              {rule.description}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${severityClass}`}
          >
            {rule.severity}
          </span>
        </div>

        <dl className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <div className="rounded-full bg-slate-100 px-3 py-2">
            <dt className="sr-only">Category</dt>
            <dd>{rule.category}</dd>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-2">
            <dt className="sr-only">Status</dt>
            <dd>{rule.isActive ? "Active" : "Inactive"}</dd>
          </div>
        </dl>
      </button>
    </li>
  );
}

export default BehaviorRuleCard;
