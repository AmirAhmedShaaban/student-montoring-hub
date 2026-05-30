function BehaviorFormField({
  id,
  label,
  hint,
  error,
  children,
  className = "",
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const field =
    typeof children === "function" ? children({ describedBy }) : children;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        {error ? (
          <span id={errorId} className="text-xs font-medium text-rose-600">
            {error}
          </span>
        ) : null}
      </div>

      {field}

      {hint ? (
        <p id={hintId} className="text-sm leading-6 text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default BehaviorFormField;
