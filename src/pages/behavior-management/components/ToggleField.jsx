function ToggleField({ id, label, checked, onChange, hint }) {
  const buttonLabel = checked ? "Active" : "Inactive";

  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${buttonLabel}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onClick={() => onChange(!checked)}
        className={`inline-flex items-center gap-3 rounded-full border px-1 py-1 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          checked
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-slate-100 text-slate-600"
        }`}
      >
        <span
          className={`flex h-7 w-10 items-center rounded-full p-1 transition ${
            checked ? "bg-emerald-600" : "bg-slate-400"
          }`}
          aria-hidden="true"
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
        <span>{buttonLabel}</span>
      </button>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm leading-6 text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default ToggleField;
