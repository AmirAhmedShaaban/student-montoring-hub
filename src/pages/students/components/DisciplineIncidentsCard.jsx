import SectionCard from "./SectionCard";

function DisciplineIncidentsCard({ count, riskLevel, trend, lastIncident }) {
  return (
    <SectionCard
      title="Discipline incidents"
      description="Current disciplinary picture and the most recent behavior event."
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-500">Incident count</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {count}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-500">Risk level</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {riskLevel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-500">Trend</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {trend}
            </p>
          </div>
        </div>

        {lastIncident ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Most recent incident
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {lastIncident.title}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {lastIncident.date} · {lastIncident.category}
            </p>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

export default DisciplineIncidentsCard;
