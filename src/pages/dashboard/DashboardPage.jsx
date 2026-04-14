import { dashboardMockData } from "../../mocks/dashboard.mock";
import {
  ActionTile,
  BehaviorRow,
  DashboardCard,
  MetricTile,
} from "./components/DashboardComponents";

function DashboardPage() {
  const data = dashboardMockData;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Dashboard overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Student behavior monitoring system
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {data.summary.note}
            </p>
          </div>

          <div className="w-full max-w-xl">
            <label
              htmlFor="student-search"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Search students
            </label>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:flex-row">
              <input
                id="student-search"
                type="search"
                name="student-search"
                placeholder="Search by name, ID, grade, or behavior tag"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <DashboardCard
            title="Student summary"
            description="Current overall system health across monitored students."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label="Total students"
                value={data.totalStudents}
                detail="Students enrolled in the active monitoring program."
                accent="bg-slate-50 text-slate-700 ring-slate-200"
              />
              <MetricTile
                label="Monitored today"
                value={data.summary.monitoredToday}
                detail="Students with activity reviewed today."
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <MetricTile
                label="Improving"
                value={data.summary.improving}
                detail="Students responding well to interventions."
                accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
              />
              <MetricTile
                label="At risk"
                value={data.studentsAtRisk}
                detail="Students requiring priority follow-up."
                accent="bg-amber-50 text-amber-700 ring-amber-100"
              />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm font-medium text-slate-600">
                  Positive behaviors
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.positiveBehaviors}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm font-medium text-slate-600">
                  Behavioral issues
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.behavioralIssues}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm font-medium text-slate-600">
                  Honor roll
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.summary.honors}
                </dd>
              </div>
            </dl>
          </DashboardCard>

          <DashboardCard
            title="Attendance"
            description="Weekly attendance snapshot with presence and punctuality signals."
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm font-medium text-slate-300">
                  Overall attendance
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight">
                  {data.attendance.rate}%
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {data.attendance.present} present, {data.attendance.late}{" "}
                  late, {data.attendance.absent} absent.
                </p>
                <div
                  className="mt-6 h-3 rounded-full bg-slate-800"
                  aria-hidden="true"
                >
                  <div
                    className="h-3 rounded-full bg-sky-400"
                    style={{ width: `${data.attendance.rate}%` }}
                  />
                </div>
                <div
                  className="mt-6 grid grid-cols-7 gap-2"
                  aria-label="Attendance trend over seven days"
                >
                  {data.attendance.trend.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-24 w-full items-end rounded-2xl bg-slate-900 p-1">
                        <div
                          className="w-full rounded-xl bg-gradient-to-t from-sky-500 to-emerald-400"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        Day {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="space-y-4">
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Present</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.attendance.present}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">
                    Late arrivals
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.attendance.late}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Absent</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.attendance.absent}
                  </p>
                </li>
              </ul>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <DashboardCard
            title="Academic snapshot"
            description="Performance indicators and learning momentum for the current period."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricTile
                label="Average GPA"
                value={data.academicSnapshot.averageGpa}
                detail="Cumulative grade point average across the active cohort."
                accent="bg-indigo-50 text-indigo-700 ring-indigo-100"
              />
              <MetricTile
                label="Assessments complete"
                value={`${data.academicSnapshot.assessmentsCompleted}%`}
                detail="Required assessments submitted on time."
                accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
              />
              <MetricTile
                label="Assignments submitted"
                value={`${data.academicSnapshot.assignmentsSubmitted}%`}
                detail="On-time homework and classwork submission rate."
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <MetricTile
                label="Reading growth"
                value={`${data.academicSnapshot.readingGrowth}%`}
                detail="Average growth in reading proficiency."
                accent="bg-amber-50 text-amber-700 ring-amber-100"
              />
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Top subjects
              </h3>
              <dl className="mt-4 space-y-3">
                {data.academicSnapshot.topSubjects.map((subject) => (
                  <div
                    key={subject.subject}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
                  >
                    <dt className="text-sm font-medium text-slate-700">
                      {subject.subject}
                    </dt>
                    <dd className="text-sm font-semibold text-slate-950">
                      {subject.score}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Quick actions"
            description="High-value actions for daily monitoring and intervention workflows."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {data.quickActions.map((action) => (
                <ActionTile key={action.label} {...action} />
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-12">
          <DashboardCard
            title="Behavior log"
            description="Most recent student behavior entries, follow-ups, and recognition notes."
          >
            <ul className="space-y-4" aria-label="Recent behavior log entries">
              {data.behaviorLog.map((entry) => (
                <BehaviorRow key={entry.id} {...entry} />
              ))}
            </ul>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
