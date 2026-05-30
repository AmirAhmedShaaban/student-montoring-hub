function HelpFooter({
  note,
  responseTime,
  supportEmail,
  supportPhone,
  supportHours,
}) {
  return (
    <footer
      id="help-footer"
      className="rounded-[2rem] border border-slate-900/60 bg-slate-950 px-6 py-6 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
            Support note
          </p>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">{note}</p>
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {responseTime}
          </div>
        </div>

        <dl className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl bg-white/5 p-4">
            <dt className="font-medium text-white">Email</dt>
            <dd className="mt-2 break-words">{supportEmail}</dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <dt className="font-medium text-white">Phone</dt>
            <dd className="mt-2">{supportPhone}</dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 sm:col-span-2 lg:col-span-1">
            <dt className="font-medium text-white">Hours</dt>
            <dd className="mt-2">{supportHours}</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}

export default HelpFooter;
