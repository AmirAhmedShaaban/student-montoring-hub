function LoginInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  inputMode,
  helpText,
}) {
  const descriptionId = helpText ? `${id}-help` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        inputMode={inputMode}
        aria-describedby={descriptionId}
        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
      />
      {helpText ? (
        <p id={descriptionId} className="text-sm text-slate-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}

export default LoginInput;
