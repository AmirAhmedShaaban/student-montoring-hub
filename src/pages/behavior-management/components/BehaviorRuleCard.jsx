const severityStyles = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  High: "bg-rose-50 text-rose-700 ring-rose-100",
};

function BehaviorRuleCard({ rule, active, onSelect, onDelete }) {
  const severityClass = severityStyles[rule.severity] || severityStyles.Medium;

  const handleDelete = (e) => {
    e.stopPropagation(); // don't select the card on delete click
    if (onDelete) {
      onDelete(rule.id);
    }
  };

  return (
    <li>
      <div className="group relative">
        {/* Main clickable area */}
        <button
          type="button"
          onClick={() => onSelect(rule.id)}
          aria-pressed={active}
          className={`w-full rounded-3xl border p-5 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
            active
              ? "border-sky-300 bg-sky-50/70"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-950">
                {rule.name || "—"}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                {rule.description || "—"}
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
              <dd>{rule.category || "—"}</dd>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-2">
              <dt className="sr-only">Status</dt>
              <dd>{rule.isActive ? "Active" : "Inactive"}</dd>
            </div>
          </dl>
        </button>

        {/* Delete button – absolute positioned on hover */}
        <button
          type="button"
          onClick={handleDelete}
          title="Delete rule"
          className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 opacity-0 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-rose-400 group-hover:opacity-100"
          aria-label={`Delete ${rule.name || "rule"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default BehaviorRuleCard;
