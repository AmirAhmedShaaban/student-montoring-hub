function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function ClusterScatterPanel({
  students,
  clusters,
  selectedStudentId,
  onSelectStudent,
}) {
  if (students.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-base font-semibold text-slate-900">
          No students match the current filters.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Reset the filters or widen the school year and grade selection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full bg-slate-950"
            aria-hidden="true"
          />
          Average grade on the x-axis
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full bg-sky-500"
            aria-hidden="true"
          />
          Absenteeism rate on the y-axis
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="absolute inset-0 px-4 py-4" aria-hidden="true">
          <div className="grid h-full grid-cols-5 grid-rows-5 gap-0">
            {Array.from({ length: 25 }).map((_, index) => (
              <div
                key={index}
                className="border-slate-200/70"
                style={{
                  borderStyle: "solid",
                  borderRightWidth: index % 5 === 4 ? 0 : 1,
                  borderBottomWidth: index >= 20 ? 0 : 1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative h-104 rounded-[1.75rem] bg-white p-4 shadow-inner shadow-slate-200/60">
          <div className="absolute inset-x-4 bottom-4 flex justify-between text-xs text-slate-400">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
          <div className="absolute left-4 top-4 flex h-[calc(100%-2rem)] flex-col justify-between text-xs text-slate-400">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>

          <div className="absolute inset-0 px-12 py-10">
            {students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              // Dynamic color coming straight from the API (hex value).
              const pointColor = student.colorCode || "#64748b";
              const left = clamp(student.gradeAverage * 0.84, 8, 92);
              const bottom = clamp(student.absenteeismRate * 0.84, 8, 92);

              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student.id)}
                  aria-pressed={isSelected}
                  aria-label={`${student.name}, ${student.riskLabel ?? "unlabeled"}, grade ${student.gradeAverage}, absenteeism ${student.absenteeismRate}%`}
                  className={`absolute flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold text-white shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 ${
                    isSelected
                      ? "scale-110 border-slate-950 ring-4 ring-slate-950/10"
                      : "border-white hover:scale-105"
                  }`}
                  style={{
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    backgroundColor: pointColor,
                  }}
                >
                  {student.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {clusters.map((cluster) => (
            <span
              key={cluster.id}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-slate-200"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cluster.dotColor || "#64748b" }}
              />
              {cluster.name} - {cluster.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClusterScatterPanel;
