import SectionCard from "./SectionCard";

function RecentIncidentsList({ incidents }) {
  if (!incidents.length) {
    return (
      <SectionCard
        title="Recent incidents"
        description="A chronological list of recent positive and disciplinary moments."
      >
        <p className="text-sm text-slate-600">No incidents recorded yet.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Recent incidents"
      description="A chronological list of recent positive and disciplinary moments."
    >
      <ul className="space-y-3" aria-label="Recent student incidents">
        {incidents.map((incident) => {
          const isNegative = incident.type === "Negative";
          const toneClass = isNegative
            ? "bg-amber-50 text-amber-700 ring-amber-100"
            : "bg-emerald-50 text-emerald-700 ring-emerald-100";

          return (
            <li
              key={incident.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {incident.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {incident.date} · {incident.category}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClass}`}
                >
                  {incident.type}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

export default RecentIncidentsList;
