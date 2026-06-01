// src/pages/students/components/BehaviorSummaryCards.jsx

function StatCard({ label, value, color = "slate" }) {
  const colors = {
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${colors[color]}`}
      >
        {label}
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

export default function BehaviorSummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Incidents"
        value={summary.totalIncidents || 0}
        color="slate"
      />
      <StatCard
        label="Pending"
        value={summary.pendingIncidents || 0}
        color="amber"
      />
      <StatCard
        label="Under Review"
        value={summary.underReviewIncidents || 0}
        color="sky"
      />
      <StatCard
        label="Confirmed"
        value={summary.confirmedIncidents || 0}
        color="emerald"
      />
    </div>
  );
}
