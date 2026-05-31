import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardMockData } from "../../mocks/dashboard.mock";
import { getAllStudents } from "../../services/studentService";
import {
  ActionTile,
  DashboardCard,
  MetricTile,
} from "./components/DashboardComponents";
import AIUploadCard from "./components/AIUploadCard";

function DashboardPage() {
  const data = useDashboardMockData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  // Load students from API on mount for real-time search
  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsLoadingStudents(true);
        const res = await getAllStudents();
        if (res.success) {
          setStudentsList(res.data);
        }
      } catch (error) {
        console.error("Error loading students for search:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    }
    fetchStudents();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Search in the real data fetched from backend
    const student = studentsList.find(
      (s) =>
        (s.fullName &&
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.studentID && s.studentID.toString() === searchQuery),
    );

    if (student) {
      navigate(`/students/${student.studentID}`);
    } else {
      alert("Student not found in the system. Please try another name or ID.");
    }
  };

  const actionRoutes = {
    "Review Risk": "/clustering",
    "Manage Rules": "/behavior-management",
    "System Settings": "/settings",
    "Student Profiles": "/students/1",
  };

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
              {data?.summary?.note || "Welcome to the monitoring system."}
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
                placeholder={
                  isLoadingStudents
                    ? "Loading students..."
                    : "Search by name or ID..."
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={isLoadingStudents}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:visible:ring-2 focus:visible:ring-sky-500 disabled:opacity-50"
                disabled={isLoadingStudents}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <AIUploadCard />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <DashboardCard
            title="Student summary"
            description="Current overall system health across monitored students."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label="Total students"
                value={data?.totalStudents || 0}
                detail="Enrolled students"
                accent="bg-slate-50 text-slate-700 ring-slate-200"
                onClick={() => navigate("/clustering")}
              />
              <MetricTile
                label="Monitored today"
                value={data?.summary?.monitoredToday || 0}
                detail="Reviewed today"
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <MetricTile
                label="Follow-ups due"
                value={data?.summary?.followUpsDue || 0}
                detail="Pending reviews"
                accent="bg-amber-50 text-amber-700 ring-amber-100"
              />
              <MetricTile
                label="At risk"
                value={data?.studentsAtRisk || 0}
                detail="Priority follow-up"
                accent="bg-rose-50 text-rose-700 ring-rose-100"
                onClick={() => navigate("/clustering")}
              />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  Positive behaviors
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data?.positiveBehaviors || 0}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  Behavioral issues
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data?.behavioralIssues || 0}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  AI insights
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {data?.summary?.aiInsights || 0}
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
                  {data?.attendance?.rate || 0}%
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {data?.attendance?.present || 0} present,{" "}
                  {data?.attendance?.late || 0} late,{" "}
                  {data?.attendance?.absent || 0} absent.
                </p>
                <div className="mt-6 h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-1000"
                    style={{ width: `${data?.attendance?.rate || 0}%` }}
                  />
                </div>
                <div className="mt-6 grid grid-cols-7 gap-2">
                  {(data?.attendance?.trend || []).map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-24 w-full items-end rounded-2xl bg-slate-900 p-1">
                        <div
                          className="w-full rounded-xl bg-gradient-to-t from-sky-500 to-emerald-400 transition-all duration-700"
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
                    {data?.attendance?.present || 0}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">
                    Late arrivals
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data?.attendance?.late || 0}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Absent</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data?.attendance?.absent || 0}
                  </p>
                </li>
              </ul>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <DashboardCard
            title="Intervention signals"
            description="Behavior and follow-up indicators for the current period."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricTile
                label="Open interventions"
                value={data?.summary?.openInterventions || 0}
                detail="Active support plan"
                accent="bg-indigo-50 text-indigo-700 ring-indigo-100"
              />
              <MetricTile
                label="Risk reviews"
                value={data?.summary?.aiInsights || 0}
                detail="Need counselor attention"
                accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
                onClick={() => navigate("/clustering")}
              />
              <MetricTile
                label="Attendance follow-up"
                value={data?.summary?.followUpsDue || 0}
                detail="Due now"
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <MetricTile
                label="Escalations"
                value={data?.summary?.escalations || 0}
                detail="Immediate admin review"
                accent="bg-rose-50 text-rose-700 ring-rose-100"
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="Quick actions"
            description="High-value actions for daily monitoring and intervention workflows."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {(data?.quickActions || []).map((action) => (
                <ActionTile
                  key={action.label}
                  title={action.label}
                  description={action.description}
                  href={actionRoutes[action.label] || "#"}
                />
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
