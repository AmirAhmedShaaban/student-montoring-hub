function AuthLoginIllustration() {
  return (
    <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] lg:flex lg:flex-col lg:justify-between">
      <div className="absolute right-[-6rem] top-[-5rem] h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[-4rem] h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />

      <div className="relative space-y-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            SB
          </span>
          Student Behavior Dashboard
        </div>

        <div className="max-w-lg space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Secure access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 xl:text-5xl">
            Calm, focused access for your student support team.
          </h1>
          <p className="text-base leading-7 text-slate-600 xl:text-lg">
            View behavior trends, coordinate interventions, and keep school
            staff aligned with a dashboard designed for clarity.
          </p>
        </div>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-3">
        {[
          { value: "24/7", label: "availability" },
          { value: "Fast", label: "insights" },
          { value: "Simple", label: "workflow" },
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
