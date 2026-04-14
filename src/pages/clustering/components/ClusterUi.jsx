function Card({ children, className = "", as }) {
  const Wrapper = as ?? "section";

  return (
    <Wrapper
      className={`rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60 backdrop-blur ${className}`.trim()}
    >
      {children}
    </Wrapper>
  );
}

function SectionHeader({ title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between ${className}`.trim()}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function Button({ variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-900/20",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-900/10",
    subtle:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-900/10",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] ?? variants.primary} ${className}`.trim()}
      {...props}
    />
  );
}

function SelectField({
  id,
  label,
  description,
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {description ? (
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SegmentedTabs({ tabs, value, onChange, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex rounded-2xl bg-slate-100 p-1"
    >
      {tabs.map((tab) => {
        const active = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 ${
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function TableShell({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-slate-200 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export { Button, Card, SectionHeader, SelectField, SegmentedTabs, TableShell };
