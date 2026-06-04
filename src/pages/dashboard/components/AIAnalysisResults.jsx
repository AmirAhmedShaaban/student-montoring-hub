// Format an ISO timestamp into a readable date/time string.
function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Normalize a confidence value into a 0-100 percentage.
// Accepts either a fraction (0.99) or an already-scaled number (99).
function toPercent(confidence) {
  const value = Number(confidence) || 0;
  const percent = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percent * 10) / 10));
}

// Pick the bar color based on the confidence level.
function confidenceColor(percent) {
  if (percent >= 85) return "bg-emerald-500";
  if (percent >= 60) return "bg-amber-500";
  return "bg-rose-500";
}

// Map a review status to a badge style.
function statusBadgeClass(status) {
  const value = String(status || "").toLowerCase();
  if (value === "verified" || value === "confirmed") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (value === "rejected") {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }
  // Pending / under review / default.
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function ConfidenceBar({ confidence }) {
  const percent = toPercent(confidence);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Confidence</span>
        <span className="font-mono text-slate-700">{percent}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${confidenceColor(percent)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function AnalysisResultCard({ result }) {
  const behaviorTitle =
    result.behaviorName || result.detail || "Detected behavior";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-950">{behaviorTitle}</h4>
          {result.behaviorName && result.detail ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {result.detail}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Student #{result.studentId ?? "—"}
            {result.source ? ` · ${result.source}` : ""}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClass(
            result.reviewStatus,
          )}`}
        >
          {result.reviewStatus || "Pending"}
        </span>
      </div>

      <ConfidenceBar confidence={result.confidence} />

      {result.occurredAt ? (
        <p className="mt-3 text-xs text-slate-400">
          Detected on {formatDateTime(result.occurredAt)}
        </p>
      ) : null}
    </article>
  );
}

/**
 * Displays the AI behavior detection results as a list of cards.
 * @param {object} props
 * @param {Array}  props.results - Array of detected behaviors from the API.
 * @param {string} [props.message] - Optional summary message from the API.
 */
function AIAnalysisResults({ results, message }) {
  const hasResults = Array.isArray(results) && results.length > 0;

  return (
    <section className="animate-[fadeIn_0.4s_ease-out] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            Analysis results
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {message ||
              "AI-detected behaviors from the uploaded classroom media."}
          </p>
        </div>
        {hasResults ? (
          <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {results.length} behavior{results.length > 1 ? "s" : ""} detected
          </span>
        ) : null}
      </div>

      <div className="pt-5">
        {hasResults ? (
          <div className="grid gap-4">
            {results.map((result, index) => (
              <AnalysisResultCard
                key={result.incidentId ?? index}
                result={result}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-base font-semibold text-slate-900">
              No behaviors detected.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The AI did not detect any behaviors in the uploaded media.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AIAnalysisResults;
