import API from "./axiosConfig";

// Base origin of the API, derived from the axios instance baseURL.
// Used to build absolute URLs for generated report files.
// Example: "http://studentmonitor.runasp.net/api" -> "http://studentmonitor.runasp.net"
const API_ORIGIN = (API.defaults.baseURL || "").replace(/\/api\/?$/, "");

/**
 * Build an absolute URL for a server-provided file path.
 * @param {string} path - Relative path returned by the backend (e.g. "/reports/x.pdf").
 * @returns {string|null}
 */
function buildFileUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalized}`;
}

/**
 * Get cluster summaries and visualization data, optionally filtered.
 * GET /Clusters/summaries
 * Response data shape: { runID, runAt, filtersApplied, numClusters, clusters[], visualizationData[] }
 * @param {{ dateRange?: string, schoolYear?: string, gradeLevel?: string }} [filters]
 */
export async function getClusterSummaries(filters = {}) {
  try {
    const params = {};
    if (filters.dateRange) params.DateRange = filters.dateRange;
    if (filters.schoolYear) params.SchoolYear = filters.schoolYear;
    if (filters.gradeLevel) params.GradeLevel = filters.gradeLevel;

    const response = await API.get("/Clusters/summaries", { params });
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to fetch cluster summaries",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error fetching cluster summaries",
    };
  }
}

/**
 * Apply filters and run/refresh the clustering, returning the full result.
 * POST /Clusters/apply-filters (JSON body)
 * Response data shape: same as getClusterSummaries.
 * @param {{ dateRange?: string, schoolYear?: string, gradeLevel?: string }} filters
 */
export async function applyClusterFilters(filters = {}) {
  try {
    const body = {
      dateRange: filters.dateRange ?? "",
      schoolYear: filters.schoolYear ?? "",
      gradeLevel: filters.gradeLevel ?? "",
    };

    const response = await API.post("/Clusters/apply-filters", body);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to apply cluster filters",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error applying cluster filters",
    };
  }
}

/**
 * Reset the applied filters on the backend.
 * POST /Clusters/reset-filters
 * Response data is a status string (e.g. "completed").
 */
export async function resetClusterFilters() {
  try {
    const response = await API.post("/Clusters/reset-filters");
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to reset cluster filters",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error resetting cluster filters",
    };
  }
}

/**
 * Get the visualization data (students with cluster assignment) for a run.
 * GET /Clusters/visualization/{runId}
 * NOTE: This endpoint returns a RAW ARRAY (not wrapped in { succeeded, data }).
 * @param {number|string} runId
 */
export async function getClusterVisualization(runId) {
  try {
    const response = await API.get(`/Clusters/visualization/${runId}`);

    // This endpoint returns the array directly.
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
      };
    }

    // Fallback in case the backend later wraps it in the standard envelope.
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
      message:
        response.data?.message || "Failed to fetch cluster visualization",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Server error fetching cluster visualization",
    };
  }
}

/**
 * Get a single student's clustering details within a run.
 * GET /Clusters/{runId}/students/{studentId}
 * Response data shape: { studentID, studentName, gradeLevel, currentGrade, attendanceRate, clusterGroupID, clusterLabel, recentIncidents[] }
 * @param {number|string} runId
 * @param {number|string} studentId
 */
export async function getClusterStudent(runId, studentId) {
  try {
    const response = await API.get(`/Clusters/${runId}/students/${studentId}`);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to fetch student details",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error fetching student details",
    };
  }
}

/**
 * Generate a cluster report (PDF) for the given filters.
 * POST /Clusters/generate-report (multipart/form-data)
 * Response data shape: { runID, reportPath, generatedAt, message }
 *
 * The Content-Type header is intentionally set to undefined so the browser
 * can attach the correct multipart boundary automatically. The returned
 * object includes a ready-to-use absolute `reportUrl`.
 *
 * @param {{ dateRange?: string, schoolYear?: string, gradeLevel?: string }} filters
 */
export async function generateClusterReport(filters = {}) {
  try {
    const formData = new FormData();
    formData.append("DateRange", filters.dateRange ?? "");
    formData.append("SchoolYear", filters.schoolYear ?? "");
    formData.append("GradeLevel", filters.gradeLevel ?? "");

    const response = await API.post("/Clusters/generate-report", formData, {
      headers: { "Content-Type": undefined },
    });

    if (response.data && response.data.succeeded) {
      const payload = response.data.data || {};
      return {
        success: true,
        data: {
          ...payload,
          reportUrl: buildFileUrl(payload.reportPath),
        },
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to generate cluster report",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error generating cluster report",
    };
  }
}
