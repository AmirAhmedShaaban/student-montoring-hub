function ProfileStatCard({
  label,
  value,
  detail,
  accent = "bg-sky-50 text-sky-700 ring-sky-100",
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${accent}`}
      >
        {label}
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

export default ProfileStatCard;
