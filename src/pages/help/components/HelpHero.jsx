function HelpHero({ title, subtitle, note }) {
  return (
    <section
      id="help-hero"
      className="relative overflow-hidden rounded-[2rem] border border-slate-900 bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_28%)]" />
      <div className="relative max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Support center
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {subtitle}
        </p>
        {note ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-400">{note}</p>
        ) : null}
      </div>
    </section>
  );
}

export default HelpHero;
