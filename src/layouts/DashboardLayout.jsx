import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getStoredSession, signOut } from "../utils/auth";

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
  const session = getStoredSession();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="border-r border-slate-200 bg-slate-950 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-72">
        <div className="flex h-full flex-col p-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 font-semibold text-white">
                <img src="logo.png" alt="logo" />
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
              Keep attendance, academic health, and behavior interventions in
              one place.
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
              <p className="font-medium text-white">Signed in as</p>
              <p className="mt-2 leading-6">{session?.name ?? "Dummy user"}</p>
              <p className="text-xs text-slate-400">{session?.email ?? ""}</p>
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
              <p className="mt-2 leading-6">
                Review 23 at-risk students and 6 pending behavior follow-ups.
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
