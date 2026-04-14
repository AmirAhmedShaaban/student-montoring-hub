import { TableShell } from "./ClusterUi";

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function ClusterTablePanel({
  students,
  clusters,
  selectedStudentId,
  onSelectStudent,
}) {
  if (students.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-base font-semibold text-slate-900">
          No clustered students available.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Adjust the active filters to restore the table results.
        </p>
      </div>
    );
  }

  return (
    <TableShell>
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <caption className="sr-only">
          Students grouped by cluster, attendance, grade, and risk label
        </caption>
        <thead className="bg-slate-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Student ID
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Cluster
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Attendance
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Grade
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Risk label
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => {
            const isSelected = student.id === selectedStudentId;
            const clusterName =
              clusters.find((cluster) => cluster.id === student.clusterId)
                ?.name ?? student.clusterId;

            return (
              <tr
                key={student.id}
                className={isSelected ? "bg-sky-50/60" : "bg-white"}
              >
                <td className="px-4 py-4 align-top">
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student.id)}
                    className="text-left font-semibold text-slate-950 transition hover:text-sky-700 focus:outline-none focus-visible:underline"
                  >
                    {student.name}
                  </button>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.gradeLevel}
                  </p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-600">
                  {student.studentId}
                </td>
                <td className="px-4 py-4 align-top text-sm font-medium text-slate-700">
                  {clusterName}
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-600">
                  {formatPercent(student.attendanceRate)}
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-600">
                  {formatPercent(student.gradeAverage)}
                </td>
                <td className="px-4 py-4 align-top">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {student.riskLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableShell>
  );
}

export default ClusterTablePanel;
