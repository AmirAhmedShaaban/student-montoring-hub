import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";
import { useDashboardMockData } from "../mocks/dashboard.mock";

const navigationItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Students", to: "/students/1" },
  { label: "Behavior", to: "/behavior-management" },
  { label: "Clustering", to: "/clustering" },
  { label: "Settings", to: "/settings" },
  { label: "Help", to: "/help" },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const dashboardData = useDashboardMockData();

  // Initialize the user state directly using the existing session storage helper
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getCurrentUser();
    return (
      session || {
        name: "Administrator",
        email: "auth@school.edu",
        role: "Admin",
      }
    );
  });

  // Effect hook to enforce session guards and handle direct component updates
  useEffect(() => {
    const activeSession = getCurrentUser();

    if (!activeSession) {
      // Security Layer: Kick back to login if session key gets wiped unexpectedly
      navigate("/login", { replace: true });
    } else {
      setCurrentUser(activeSession);
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      // Fire real async HTTP clear sequence against SmarterASP.NET backend
      await logout();
    } catch (error) {
      console.error(
        "Session destruction execution trace sync exception:",
        error,
      );
    } finally {
      // Hard routing push to gateway ensuring memory context drops the current layout
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="border-r border-slate-200 bg-slate-950 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-72">
        <div className="flex h-full flex-col p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 font-semibold text-white">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Student Behavior
                </p>
                <h1 className="text-lg font-semibold text-white">
                  Monitoring Hub
                </h1>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Monitor attendance, behavior incidents, and intervention activity.
            </p>
          </div>

          <nav className="mt-8 flex-1" aria-label="Dashboard navigation">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "block rounded-2xl px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                        isActive
                          ? "bg-white text-slate-950"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-white">Signed in as</p>
                {/* Dynamic Role Badge mapping straight from live storage */}
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </div>
              <p
                className="mt-2 leading-6 font-semibold text-white truncate"
                title={currentUser.name}
              >
                {currentUser.name}
              </p>
              <p
                className="text-xs text-slate-400 truncate"
                title={currentUser.email}
              >
                {currentUser.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Sign out
            </button>

            <div>
              <p className="font-medium text-white">Today&apos;s snapshot</p>
              <p className="mt-2 leading-6 text-slate-400 text-xs">
                Review {dashboardData?.summary?.atRiskStudents || 0} at-risk
                students, {dashboardData?.summary?.pendingFollowUps || 0}{" "}
                pending follow-ups,{" "}
                {dashboardData?.summary?.activeInterventions || 0} active
                interventions, and {dashboardData?.summary?.flaggedCases || 0}{" "}
                flagged cases.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
