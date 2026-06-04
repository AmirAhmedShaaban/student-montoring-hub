import { useEffect, useState } from "react";

import { Button, SelectField } from "./ClusterUi";
import { generateClusterReport } from "../../../services/clusteringService";
import { FILTER_CONSTANTS } from "../../../services/clustering.constants";

const reportFilterOptions = {
  dateRanges: FILTER_CONSTANTS.DATE_RANGES,
  schoolYears: FILTER_CONSTANTS.SCHOOL_YEARS,
  gradeLevels: FILTER_CONSTANTS.GRADE_LEVELS,
};

// Format an ISO timestamp into a readable string.
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

/**
 * Modal for generating a cluster report.
 * Prefilled with the page's applied filters (linked), allows light edits,
 * auto-opens the generated PDF, and keeps a manual download link.
 */
function ClusterReportModal({ open, onClose, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Reset the modal state every time it opens, prefilled with current filters.
  useEffect(() => {
    if (open) {
      setFilters(initialFilters);
      setResult(null);
      setError(null);
      setIsGenerating(false);
    }
  }, [open, initialFilters]);

  // Close on Escape key for accessibility.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    setError(null);
    setResult(null);

    const payload = {
      dateRange: filters.dateRange,
      schoolYear: filters.schoolYear,
      gradeLevel: filters.gradeLevel,
    };

    const res = await generateClusterReport(payload);
    setIsGenerating(false);

    if (res.success) {
      setResult(res.data);
      // Auto-open the generated PDF in a new tab.
      if (res.data?.reportUrl) {
        window.open(res.data.reportUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      setError(res.message || "Failed to generate the report.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cluster-report-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2
              id="cluster-report-title"
              className="text-lg font-semibold text-slate-950"
            >
              Generate cluster report
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Confirm the filters below, then generate a PDF report.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="pt-5" onSubmit={handleGenerate}>
          <div className="grid gap-4">
            <SelectField
              id="report-date-range"
              label="Date range"
              value={filters.dateRange}
              onChange={(event) =>
                handleChange("dateRange", event.target.value)
              }
              options={reportFilterOptions.dateRanges}
            />
            <SelectField
              id="report-school-year"
              label="School year"
              value={filters.schoolYear}
              onChange={(event) =>
                handleChange("schoolYear", event.target.value)
              }
              options={reportFilterOptions.schoolYears}
            />
            <SelectField
              id="report-grade-level"
              label="Grade level"
              value={filters.gradeLevel}
              onChange={(event) =>
                handleChange("gradeLevel", event.target.value)
              }
              options={reportFilterOptions.gradeLevels}
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">
                Report generated successfully.
              </p>
              {result.generatedAt ? (
                <p className="mt-1 text-sm text-emerald-700">
                  Generated on {formatDateTime(result.generatedAt)}.
                </p>
              ) : null}
              {result.reportUrl ? (
                <a
                  href={result.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Open / Download report
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <Button type="button" variant="secondary" onClick={onClose}>
              {result ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating
                ? "Generating..."
                : result
                  ? "Regenerate"
                  : "Generate report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClusterReportModal;
