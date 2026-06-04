// Static filter options aligned with the backend expected values.
// These are intentionally kept separate so they can be reused anywhere
// (page, header, reports) without importing the service.

export const FILTER_CONSTANTS = {
  DATE_RANGES: [
    { label: "Last 30 days", value: "last 30 days" },
    { label: "Last 90 days", value: "last 90 days" },
    { label: "Current academic year", value: "current academic year" },
  ],
  SCHOOL_YEARS: [
    { label: "2025-2026", value: "2025-2026" },
    { label: "2024-2025", value: "2024-2025" },
  ],
  GRADE_LEVELS: [
    { label: "All grades", value: "all" },
    { label: "Grade 10", value: "10" },
    { label: "Grade 11", value: "11" },
    { label: "Grade 12", value: "12" },
  ],
};

// Default filter values used on initial load and on reset.
export const DEFAULT_FILTERS = {
  dateRange: "last 90 days",
  schoolYear: "2025-2026",
  gradeLevel: "all",
};
