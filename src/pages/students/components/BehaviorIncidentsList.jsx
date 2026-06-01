// src/pages/students/components/BehaviorIncidentsList.jsx

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 ring-amber-200",
    UnderReview: "bg-sky-100 text-sky-700 ring-sky-200",
    Confirmed: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    Rejected: "bg-rose-100 text-rose-700 ring-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

export default function BehaviorIncidentsList({ incidents = [] }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          No behavior incidents found for this student.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-950">
          Incident History
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          All recorded behavior incidents for this student
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {incidents.map((incident, index) => (
          <div
            key={index}
            className="px-6 py-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-slate-950">
                    {incident.ruleName || "Unknown Rule"}
                  </p>
                  <StatusBadge status={incident.reviewStatusDisplay} />
                </div>

                <p className="text-sm text-slate-600 mb-1">{incident.detail}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    Source:{" "}
                    <span className="font-medium text-slate-700">
                      {incident.source}
                    </span>
                  </span>
                  <span>
                    Date:{" "}
                    <span className="font-medium text-slate-700">
                      {new Date(incident.occurredAt).toLocaleDateString()}
                    </span>
                  </span>
                  {incident.confidence && (
                    <span>
                      Confidence:{" "}
                      <span className="font-medium text-slate-700">
                        {(incident.confidence * 100).toFixed(0)}%
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
