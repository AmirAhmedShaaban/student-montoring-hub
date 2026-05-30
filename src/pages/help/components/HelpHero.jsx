function HelpHero({ title, subtitle, note }) {
  return (
    <section
      id="help-hero"
      className="relative overflow-hidden rounded-[2rem] border border-slate-900/60 bg-[linear-gradient(135deg,#07101c_0%,#0d1f36_56%,#123b66_100%)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:px-8 sm:py-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="relative max-w-3xl space-y-5">
        <span className="inline-flex rounded-full border border-sky-400/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
          Help & Support
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            {subtitle}
          </p>
          {note ? (
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default HelpHero;
