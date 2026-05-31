// src/pages/dashboard/components/StudentAcademicCard.jsx

export default function StudentAcademicCard({ academicData, onClose }) {
  if (!academicData) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            Academic Performance
          </h3>
          <p className="text-sm text-slate-500">{academicData.fullName}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            Assessments Completed
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {academicData.assessmentCompleted || 0}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">
            Assignments Submitted
          </p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {academicData.assignmentSubmitted || 0}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">Reading Words</p>
          <p className="mt-1 text-3xl font-semibold text-slate-950">
            {academicData.readingWords || 0}
          </p>
        </div>
      </div>

      {/* Top 3 Subjects */}
      {academicData.topThreeSubjects &&
        academicData.topThreeSubjects.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-slate-600">
              Top 3 Subjects
            </p>
            <div className="space-y-3">
              {academicData.topThreeSubjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-950">
                      {subject.subject}
                    </p>
                    <p className="text-xs text-slate-500">
                      Grade: {subject.gradeLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-slate-950">
                      {subject.score}
                    </p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
