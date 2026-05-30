import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";

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
  return (
    <SectionCard
      title={student.name}
      description="Student behavior, attendance, and intervention notes in one place."
      action={
        <Link
          to="/dashboard"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Back to dashboard
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-bold text-white shadow-lg shadow-slate-950/15">
            {student.initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">Grade {student.grade}</Badge>
              <Badge tone="green">{student.riskLevel} risk</Badge>
              <Badge tone="slate">Homeroom {student.className}</Badge>
            </div>

            <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-500">Student ID</dt>
                <dd className="mt-1 text-base font-medium text-slate-950">
                  {student.id}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Email</dt>
                <dd className="mt-1 break-all text-base font-medium text-slate-950">
                  {student.email}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Enrollment date</dt>
                <dd className="mt-1 text-base font-medium text-slate-950">
                  {student.enrollmentDate}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Quick summary</dt>
                <dd className="mt-1 text-base font-medium text-slate-950">
                  Current support plan with active monitoring.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Focus area</p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            {student.riskLevel} support
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the behavior and notes tabs to track interventions, family follow-up, and progress.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export default StudentProfileHeader;
