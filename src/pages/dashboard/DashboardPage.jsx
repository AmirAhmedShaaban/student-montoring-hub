import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loadingAcademic, setLoadingAcademic] = useState(false);

  // ==================== MOCK DATA FOR CHARTS ====================
  const riskDistribution = [
    { name: "Low", value: 68 },
    { name: "Medium", value: 24 },
    { name: "High", value: 8 },
  ];

  const attendanceDistribution = [
    { name: "Ahmed Mohamed", attendance: 92 },
    { name: "Sara Ali", attendance: 88 },
    { name: "Omar Khaled", attendance: 75 },
    { name: "Nour Hassan", attendance: 95 },
    { name: "Youssef Ibrahim", attendance: 68 },
  ];

  const topPerformers = [
    { name: "Hassan Farouk", average: 96 },
    { name: "Sara Ali", average: 93.7 },
    { name: "Mariam Said", average: 89.8 },
    { name: "Nour Hassan", average: 88.2 },
    { name: "Ahmed Mohamed", average: 88.1 },
  ];

  // ==================== EXISTING LOGIC ====================
  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsLoadingStudents(true);
        const res = await getAllStudents();
        if (res.success) setStudentsList(res.data);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    }
    fetchStudents();
  }, []);

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
      if (academicRes.success) setAcademicData(academicRes.data);
      setLoadingAcademic(false);
    } else {
      setSearchMessage({ type: "error", text: "Student not found." });
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
    <div className="space-y-8">
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

      {/* Academic Card */}
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

      {/* Charts Section */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Risk Distribution */}
        <div className="xl:col-span-4">
          <DashboardCard
            title="Risk Distribution"
            description="Student risk levels"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="riskGrad1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#DA11CB" />
                      <stop offset="100%" stopColor="#6665D8" />
                    </linearGradient>
                    <linearGradient id="riskGrad2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6665D8" />
                      <stop offset="100%" stopColor="#003CFF" />
                    </linearGradient>
                    <linearGradient id="riskGrad3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#003CFF" />
                      <stop offset="100%" stopColor="#0090FF" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                  >
                    <Cell fill="url(#riskGrad1)" />
                    <Cell fill="url(#riskGrad2)" />
                    <Cell fill="url(#riskGrad3)" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Attendance Distribution */}
        <div className="xl:col-span-8">
          <DashboardCard
            title="Attendance Distribution"
            description="Top students by attendance"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceDistribution}>
                  <defs>
                    {/* Vibrant SaaS gradient for attendance bars */}
                    <linearGradient
                      id="attendanceGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#36d1dc" />
                      <stop offset="100%" stopColor="#5b86e5" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis domain={[50, 100]} stroke="#64748b" />
                  <Tooltip />
                  <Bar
                    dataKey="attendance"
                    fill="url(#attendanceGrad)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

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

      {/* Attendance + Top Performers Side by Side */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Attendance */}
        <div className="xl:col-span-6">
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

        {/* Top Performers (Honor Roll) */}
        <div className="xl:col-span-6">
          <DashboardCard
            title="Top Performers (Honor Roll)"
            description="Highest academic averages"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPerformers}>
                  <defs>
                    {/* Futuristic/Neon gradient for top performers bars */}
                    <linearGradient
                      id="topPerformersGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4568DC" />
                      <stop offset="100%" stopColor="#B06AB3" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis domain={[80, 100]} stroke="#64748b" />
                  <Tooltip />
                  <Bar
                    dataKey="average"
                    fill="url(#topPerformersGrad)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
