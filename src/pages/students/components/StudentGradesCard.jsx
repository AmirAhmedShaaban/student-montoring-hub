// src/pages/students/components/StudentGradesCard.jsx

function GradeRow({ grade }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 transition">
      <div>
        <p className="font-semibold text-slate-950">{grade.subject}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {grade.term} • {new Date(grade.date).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold text-slate-950">{grade.score}</p>
        <p className="text-xs text-slate-500">{grade.gradeLabel}</p>
      </div>
    </div>
  );
}

export default function StudentGradesCard({ grades = [], averageData }) {
  if (!grades || grades.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">No grades available for this student.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {averageData && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Average Score</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950">
              {averageData.averageScore?.toFixed(1)}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Total Subjects</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950">
              {averageData.totalSubjects}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Highest Score</p>
            <p className="mt-2 text-4xl font-semibold text-emerald-600">
              {averageData.highestScore}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Lowest Score</p>
            <p className="mt-2 text-4xl font-semibold text-rose-600">
              {averageData.lowestScore}
            </p>
          </div>
        </div>
      )}

      {/* Grades List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-950 mb-5">
          All Grades
        </h3>
        <div className="space-y-3">
          {grades.map((grade, index) => (
            <GradeRow key={index} grade={grade} />
          ))}
        </div>
      </div>
    </div>
  );
}
