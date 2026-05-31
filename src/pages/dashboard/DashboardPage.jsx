import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../services/studentService";
import {
  ActionTile,
  DashboardCard,
  MetricTile,
} from "./components/DashboardComponents";
import AIUploadCard from "./components/AIUploadCard";
import StudentAcademicCard from "./components/StudentAcademicCard";
import {
  getDashboardStats,
  getAllAttendanceCounts,
  getStudentAcademic,
} from "../../services/dashboardService";

const actionIcons = {
  "Record behavior note": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  "Open student profile": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  "Review clustering": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2z"
      />
    </svg>
  ),
};

function DashboardPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [searchMessage, setSearchMessage] = useState(null);

  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Academic data
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loadingAcademic, setLoadingAcademic] = useState(false);

  // Load students for search
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingDashboard(true);

      const [statsRes, attendanceRes] = await Promise.all([
        getDashboardStats(),
        getAllAttendanceCounts(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (attendanceRes.success) setAttendance(attendanceRes.data);

      setLoadingDashboard(false);
    };

    fetchDashboardData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchMessage(null);
    setAcademicData(null);
    setSelectedStudent(null);

    const student = studentsList.find(
      (s) =>
        (s.fullName &&
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.studentID && s.studentID.toString() === searchQuery),
    );

    if (student) {
      setSelectedStudent(student);
      setSearchMessage({ type: "success", text: "Student found." });

      setLoadingAcademic(true);
      const academicRes = await getStudentAcademic(student.studentID);
      if (academicRes.success) {
        setAcademicData(academicRes.data);
      }
      setLoadingAcademic(false);
    } else {
      setSearchMessage({
        type: "error",
        text: "Student not found. Please try another name or ID.",
      });
    }
  };

  const actionRoutes = {
    "Record behavior note": "/behavior-management",
    "Open student profile": "/students/1",
    "Review clustering": "/clustering",
  };

  if (loadingDashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Dashboard overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Student behavior monitoring system
            </h1>
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
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                disabled={isLoadingStudents}
              >
                Search
              </button>
            </div>

            {searchMessage && (
              <p
                className={`mt-2 text-sm font-medium ${searchMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}
              >
                {searchMessage.text}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Academic Card - Dynamic on Search */}
      {selectedStudent && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-medium text-slate-600">
              Academic Information
            </p>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setAcademicData(null);
                setSearchQuery("");
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          </div>

          {loadingAcademic ? (
            <div className="flex h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
            </div>
          ) : (
            <StudentAcademicCard academicData={academicData} />
          )}
        </div>
      )}

      {/* Quick Actions */}
      <DashboardCard
        title="Quick actions"
        description="High-value actions for daily monitoring and intervention workflows."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Record behavior note",
              description: "Log a positive note or intervention update.",
            },
            {
              label: "Open student profile",
              description:
                "Review attendance, incidents, and follow-up history.",
            },
            {
              label: "Review clustering",
              description:
                "See risk groups and AI-assisted intervention segments.",
            },
          ].map((action) => (
            <ActionTile
              key={action.label}
              title={action.label}
              description={action.description}
              href={actionRoutes[action.label] || "#"}
              icon={actionIcons[action.label]}
            />
          ))}
        </div>
      </DashboardCard>

      <AIUploadCard />

      {/* Student Summary + Attendance + Intervention */}
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <DashboardCard
            title="Student summary"
            description="Current overall system health across monitored students."
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label="Total students"
                value={stats?.totalStudents || 0}
                detail="Enrolled students"
                accent="bg-slate-50 text-slate-700 ring-slate-200"
                onClick={() => navigate("/clustering")}
              />
              <MetricTile
                label="Monitored today"
                value={stats?.studentsMonitoreditToday || 0}
                detail="Reviewed today"
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <MetricTile
                label="At risk"
                value={stats?.studentsAtRisk || 0}
                detail="Priority follow-up"
                accent="bg-rose-50 text-rose-700 ring-rose-100"
                onClick={() => navigate("/clustering")}
              />
              <MetricTile
                label="Positive behaviors"
                value={stats?.positiveBehaviors || 0}
                detail="This period"
                accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
              />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  Behavioral issues
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats?.behavioralIssues || 0}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  Honor Roll
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats?.honorRoll || 0}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 cursor-default">
                <dt className="text-sm font-medium text-slate-600">
                  Students Improving
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats?.studentsImproving || 0}
                </dd>
              </div>
            </dl>
          </DashboardCard>

          <DashboardCard
            title="Attendance"
            description="Current attendance overview"
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm font-medium text-slate-300">
                  Overall attendance
                </p>
                <p className="mt-3 text-5xl font-semibold tracking-tight">
                  {stats?.presentStudents || 0}%
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {attendance.present} present, {attendance.late} late,{" "}
                  {attendance.absent} absent.
                </p>
              </div>

              <ul className="space-y-4">
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Present</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {attendance.present}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Late</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {attendance.late}
                  </p>
                </li>
                <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">Absent</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {attendance.absent}
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
                label="At risk"
                value={stats?.studentsAtRisk || 0}
                detail="Priority follow-up"
                accent="bg-rose-50 text-rose-700 ring-rose-100"
              />
              <MetricTile
                label="Positive behaviors"
                value={stats?.positiveBehaviors || 0}
                detail="This period"
                accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
              />
              <MetricTile
                label="Behavioral issues"
                value={stats?.behavioralIssues || 0}
                detail="Needs attention"
                accent="bg-amber-50 text-amber-700 ring-amber-100"
              />
              <MetricTile
                label="Honor Roll"
                value={stats?.honorRoll || 0}
                detail="Top performers"
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
