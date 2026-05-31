import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import StudentSelector from "./StudentSelector";

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function StudentProfileHeader({ student }) {
  // Ensuring we have a valid ID to pass to the selector
  const studentId = student?.id || student?.studentID;

  return (
    <SectionCard
      title={student.name || student.fullname}
      description="Student behavior, attendance, and intervention notes in one place."
      action={
        <div className="flex items-center gap-3">
          <StudentSelector currentStudentId={studentId} />

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-3xl font-bold text-white shadow-xl shadow-slate-950/20">
            {student.initials}
          </div>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="sky">Grade: {student.grade}</Badge>
              <Badge tone="green">{student.riskLevel} risk</Badge>
              <Badge tone="slate">Homeroom: {student.className}</Badge>
            </div>

            <dl className="grid gap-y-6 gap-x-12 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Student ID
                </dt>
                <dd className="text-base font-medium text-slate-950">
                  {student.id}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </dt>
                <dd className="text-base font-medium text-slate-950 break-all">
                  {student.email}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Enrollment Date
                </dt>
                <dd className="text-base font-medium text-slate-950">
                  {student.enrollmentDate}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick Summary
                </dt>
                <dd className="text-base font-medium text-slate-950 leading-relaxed">
                  Current support plan with active monitoring.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Focus area
              </p>
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-950 mb-3">
              {student.riskLevel} support
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Use the behavior and notes tabs to track interventions, family
              follow-up, and progress.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default StudentProfileHeader;
