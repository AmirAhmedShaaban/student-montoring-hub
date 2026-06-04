function AuthLoginIllustration() {
  return (
    <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] lg:flex lg:flex-col lg:justify-between">
      <div className="absolute right-[-6rem] top-[-5rem] h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[-4rem] h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="relative space-y-8">
        {/* Logo (uses Logo-prev.png because the background is light) */}
        <img
          src="/Logo-prev.png"
          alt="Student Behavior Dashboard logo"
          className="h-20 w-auto object-contain"
        />

        <div className="max-w-lg space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Staff access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 xl:text-5xl">
            Behavior monitoring and AI analysis in one workspace.
          </h1>
          <p className="text-base leading-7 text-slate-600 xl:text-lg">
            Review attendance, incidents, and intervention follow-up from a
            focused school dashboard.
          </p>
        </div>
      </div>
      <div className="relative grid gap-4 sm:grid-cols-3">
        {[
          { value: "Attendance", label: "review" },
          { value: "Risk", label: "flags" },
          { value: "Follow-up", label: "tracking" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-sm backdrop-blur"
          >
            <div className="text-2xl font-semibold text-slate-900">
              {item.value}
            </div>
            <div className="mt-1 text-sm text-slate-600">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthLoginIllustration;
