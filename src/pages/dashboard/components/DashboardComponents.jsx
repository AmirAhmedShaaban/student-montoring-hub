import { Link } from "react-router-dom";

export function DashboardCard({
  title,
  description,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  accent = "bg-sky-50 text-sky-700 ring-sky-100",
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${accent}`}
      >
        {label}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

export function ProgressRow({ label, value, detail, accent = "bg-sky-500" }) {
  return (
    <li className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${accent}`}
          style={{ width: `${value}` }}
        />
      </div>
      {detail ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
      ) : null}
    </li>
  );
}

export function ActionTile({ title, description, href }) {
  return (
    <Link
      to={href}
      className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <h3 className="font-semibold text-slate-950 group-hover:text-sky-800">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-sky-700">
        Open action
      </span>
    </Link>
  );
}

export function BehaviorRow({ student, type, detail, time }) {
  const isPositive = type === "Positive";
  const toneClass = isPositive
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 p-4">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
        {student
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-950">{student}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClass}`}
          >
            {type}
          </span>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          {time}
        </p>
      </div>
    </li>
  );
}
