import { Card, SectionHeader } from "./ClusterUi";

function ClusterDetailsPanel({ student }) {
  return (
    <Card as="aside" aria-live="polite">
      <SectionHeader
        title="Selected student"
        description="Review the latest summary, notes, and suggested next action."
      />

      {student ? (
        <div className="space-y-5 pt-5">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              {student.name}
            </h3>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {student.studentId} · {student.gradeLevel}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm font-medium text-slate-500">
                Current grade
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">
                {Math.round(student.gradeAverage)}%
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm font-medium text-slate-500">
                Attendance in last 90 days
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">
                {Math.round(student.attendanceRate)}%
              </dd>
            </div>
          </dl>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recent incidents
            </h4>
            <ul className="mt-3 space-y-2">
              {student.recentIncidents.map((incident) => (
                <li
                  key={incident}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {incident}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Recent note
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {student.recentNote}
            </p>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Suggested action
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {student.suggestedAction}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-base font-semibold text-slate-900">
            No student selected.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a point in the scatter plot or a row in the table to inspect
            the student profile.
          </p>
        </div>
      )}
    </Card>
  );
}

export default ClusterDetailsPanel;
