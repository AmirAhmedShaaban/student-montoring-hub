function formatPercent(value) {
  return typeof value === "number" ? `${Math.round(value)}%` : "—";
}

function ClusterSummaryCard({ cluster }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            {cluster.name}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">
            {cluster.label}
          </h3>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cluster.badgeClass}`}
        >
          {cluster.studentCount} students
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-sm font-medium text-slate-500">Avg attendance</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-950">
            {formatPercent(cluster.avgAttendance)}
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-sm font-medium text-slate-500">Avg grade</dt>
          <dd className="mt-1 text-xl font-semibold text-slate-950">
            {formatPercent(cluster.avgGrade)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        <span className="font-semibold text-slate-700">Main issue:</span>{" "}
        {cluster.mainIssue}
      </p>
    </article>
  );
}

export default ClusterSummaryCard;
