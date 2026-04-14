import { useState } from "react";

function Card({ id, title, description, action, children, className = "" }) {
  return (
    <section
      id={id}
      className={`rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60 backdrop-blur sm:p-8 ${className}`.trim()}
    >
      {title || description || action ? (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className={title || description || action ? "pt-5" : ""}>
        {children}
      </div>
    </section>
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

function FieldShell({ id, label, description, error, children }) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
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

function Input({ id, label, description, error, className = "", ...props }) {
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

function TextArea({ id, label, description, error, className = "", ...props }) {
  return (
    <FieldShell id={id} label={label} description={description} error={error}>
      {({ describedBy }) => (
        <textarea
          id={id}
          name={id}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          className={`${fieldClassName(Boolean(error))} min-h-32 resize-y ${className}`.trim()}
          {...props}
        />
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
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] ?? variants.primary} ${className}`.trim()}
      {...props}
    />
  );
}

function Accordion({ children, className = "" }) {
  return <div className={`space-y-4 ${className}`.trim()}>{children}</div>;
}

function AccordionItem({ id, title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 transition hover:border-slate-300">
      <h3 className="m-0">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset"
        >
          <span className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-500 shadow-sm"
          >
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="px-4 pb-4"
      >
        <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Accordion, AccordionItem, Button, Card, Input, TextArea };
