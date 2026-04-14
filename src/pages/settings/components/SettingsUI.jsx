function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60 backdrop-blur ${className}`.trim()}
    >
      {children}
    </section>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
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

function fieldClassName(hasError = false) {
  return [
    "block w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4",
    hasError
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
      : "border-slate-200 focus:border-sky-500 focus:ring-sky-500/10",
  ].join(" ");
}

function FieldShell({
  id,
  label,
  description,
  error,
  children,
  className = "",
}) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {typeof children === "function" ? children({ describedBy }) : children}
      {description ? (
        <p id={descriptionId} className="text-sm leading-6 text-slate-500">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextInput({
  id,
  label,
  description,
  error,
  className = "",
  ...props
}) {
  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      {({ describedBy }) => (
        <input
          id={id}
          name={id}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          className={`${fieldClassName(Boolean(error))} ${className}`.trim()}
          {...props}
        />
      )}
    </FieldShell>
  );
}

function PasswordInput(props) {
  return (
    <TextInput type="password" autoComplete="current-password" {...props} />
  );
}

function SelectField({
  id,
  label,
  description,
  error,
  className = "",
  children,
  ...props
}) {
  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      {({ describedBy }) => (
        <select
          id={id}
          name={id}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          className={`${fieldClassName(Boolean(error))} ${className}`.trim()}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}

function Button({ variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-900/20",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-900/10",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500/20",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] ?? variants.primary} ${className}`.trim()}
      {...props}
    />
  );
}

function ToggleSwitch({ id, label, description, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300"
    >
      <span className="space-y-1">
        <span className="block text-sm font-medium text-slate-800">
          {label}
        </span>
        {description ? (
          <span className="block text-sm leading-6 text-slate-500">
            {description}
          </span>
        ) : null}
      </span>

      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-sky-500" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export {
  Card,
  SectionHeader,
  TextInput,
  PasswordInput,
  SelectField,
  Button,
  ToggleSwitch,
};
