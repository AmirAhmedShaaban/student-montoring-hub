import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getClusterSummaries,
  applyClusterFilters,
  resetClusterFilters,
  getClusterStudent,
  generateClusterReport,
} from "../../services/clusteringService";
import {
  FILTER_CONSTANTS,
  DEFAULT_FILTERS,
} from "../../services/clustering.constants";

import ClusterDetailsPanel from "./components/ClusterDetailsPanel";
import ClusterFilters from "./components/ClusterFilters";
import ClusterPageHeader from "./components/ClusterPageHeader";
import ClusterScatterPanel from "./components/ClusterScatterPanel";
import ClusterSummaryList from "./components/ClusterSummaryList";
import ClusterTablePanel from "./components/ClusterTablePanel";
import ClusterViewTabs from "./components/ClusterViewTabs";
import GenerateReportButton from "./components/GenerateReportButton";

// Filter options passed to the dropdowns (aligned with backend values).
const filterOptions = {
  dateRanges: FILTER_CONSTANTS.DATE_RANGES,
  schoolYears: FILTER_CONSTANTS.SCHOOL_YEARS,
  gradeLevels: FILTER_CONSTANTS.GRADE_LEVELS,
};

// Clean up the backend's duplicated grade level (e.g. "Grade Grade 10").
function cleanGradeLevel(value) {
  if (!value) return "";
  return value.replace(/Grade\s+Grade/i, "Grade").trim();
}

// Normalize a cluster object coming from the API to the shape the UI expects.
function normalizeCluster(apiCluster) {
  return {
    id: apiCluster.groupID,
    name: apiCluster.clusterName,
    label: apiCluster.clusterLabel,
    mainIssue: apiCluster.mainIssue,
    studentCount: apiCluster.studentCount,
    avgAttendance:
      typeof apiCluster.avgAttendance === "number"
        ? apiCluster.avgAttendance
        : null,
    avgGrade:
      typeof apiCluster.avgGrade === "number" ? apiCluster.avgGrade : null,
    // The cluster colorCode contains Tailwind classes (badge styling).
    badgeClass: apiCluster.colorCode || "bg-slate-100 text-slate-700",
  };
}

// Normalize a visualization student to the shape the UI expects.
function normalizeStudent(apiStudent) {
  const attendanceRate = Number(apiStudent.attendanceRate) || 0;
  return {
    id: apiStudent.studentID,
    studentId: apiStudent.studentCode || `#${apiStudent.studentID}`,
    name: apiStudent.studentName,
    clusterId: apiStudent.groupID,
    gradeLevel: cleanGradeLevel(apiStudent.gradeLevel),
    gradeAverage: Number(apiStudent.averageGrade) || 0,
    attendanceRate,
    // Backend does not provide absenteeism, derive it from attendance.
    absenteeismRate: Math.max(0, 100 - attendanceRate),
    riskLabel: apiStudent.riskLabel,
    // Dynamic point color (hex) for the scatter plot.
    colorCode: apiStudent.colorCode || "#64748b",
  };
}

// Normalize a single student's detailed clustering record.
function normalizeStudentDetails(apiStudent) {
  return {
    id: apiStudent.studentID,
    studentId: apiStudent.studentCode || `#${apiStudent.studentID}`,
    name: apiStudent.studentName,
    gradeLevel: cleanGradeLevel(apiStudent.gradeLevel),
    gradeAverage: Number(apiStudent.currentGrade) || 0,
    attendanceRate: Number(apiStudent.attendanceRate) || 0,
    clusterId: apiStudent.clusterGroupID,
    clusterLabel: apiStudent.clusterLabel,
    recentIncidents: apiStudent.recentIncidents || [],
    // note / suggestedAction are not provided by the API yet.
    recentNote: apiStudent.recentNote || null,
    suggestedAction: apiStudent.suggestedAction || null,
  };
}

const viewTabs = [
  { id: "scatter", label: "Scatter view" },
  { id: "table", label: "Table view" },
];

function StudentClusteringPage() {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [activeView, setActiveView] = useState("scatter");

  // Clustering run data coming from the backend.
  const [runId, setRunId] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Selected student details (fetched on select).
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);

  // Report generation state.
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Build the filter payload, omitting "all" grade level so it is not sent.
  const buildFilterPayload = useCallback((filters) => {
    return {
      dateRange: filters.dateRange,
      schoolYear: filters.schoolYear,
      gradeLevel: filters.gradeLevel === "all" ? "" : filters.gradeLevel,
    };
  }, []);

  // Apply a clustering result (clusters + visualization) to local state.
  const applyResult = useCallback((data) => {
    if (!data) return;
    setRunId(data.runID ?? null);
    setClusters((data.clusters || []).map(normalizeCluster));
    setStudents((data.visualizationData || []).map(normalizeStudent));
  }, []);

  // Initial load: fetch summaries with the default filters.
  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      const res = await getClusterSummaries(
        buildFilterPayload(DEFAULT_FILTERS),
      );
      if (!active) return;
      if (res.success) {
        applyResult(res.data);
      } else {
        setLoadError(res.message || "Failed to load clustering data.");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [applyResult, buildFilterPayload]);

  // Derive a color (hex) for each cluster from its students, so the scatter
  // legend dots match the point colors.
  const clustersWithColor = useMemo(() => {
    return clusters.map((cluster) => {
      const member = students.find((s) => s.clusterId === cluster.id);
      return { ...cluster, dotColor: member?.colorCode || "#64748b" };
    });
  }, [clusters, students]);

  // Keep a valid active selection within the current students.
  const activeStudentId = useMemo(() => {
    if (students.length === 0) return null;
    const exists = students.some((s) => s.id === selectedStudentId);
    return exists ? selectedStudentId : students[0].id;
  }, [selectedStudentId, students]);

  // Fetch the detailed record whenever the active student or run changes.
  useEffect(() => {
    if (!runId || !activeStudentId) {
      setSelectedStudent(null);
      return;
    }

    let active = true;
    const loadStudent = async () => {
      setIsLoadingStudent(true);
      const res = await getClusterStudent(runId, activeStudentId);
      if (!active) return;
      if (res.success) {
        setSelectedStudent(normalizeStudentDetails(res.data));
      } else {
        // Fall back to the basic visualization data on failure.
        const fallback = students.find((s) => s.id === activeStudentId) || null;
        setSelectedStudent(fallback);
      }
      setIsLoadingStudent(false);
    };
    loadStudent();
    return () => {
      active = false;
    };
  }, [runId, activeStudentId, students]);

  const handleFilterChange = (field, value) => {
    setDraftFilters((current) => ({ ...current, [field]: value }));
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setLoadError(null);
    setSelectedStudentId(null);
    const res = await applyClusterFilters(buildFilterPayload(draftFilters));
    if (res.success) {
      setAppliedFilters(draftFilters);
      applyResult(res.data);
    } else {
      setLoadError(res.message || "Failed to apply filters.");
    }
    setIsLoading(false);
  };

  const handleResetFilters = async () => {
    setIsLoading(true);
    setLoadError(null);
    setSelectedStudentId(null);
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);

    await resetClusterFilters();
    const res = await getClusterSummaries(buildFilterPayload(DEFAULT_FILTERS));
    if (res.success) {
      applyResult(res.data);
    } else {
      setLoadError(res.message || "Failed to reset filters.");
    }
    setIsLoading(false);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const res = await generateClusterReport(buildFilterPayload(appliedFilters));
    setIsGeneratingReport(false);
    if (res.success && res.data?.reportUrl) {
      window.open(res.data.reportUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <ClusterPageHeader
        title="Student Clustering"
        subtitle="Group students by behavior, attendance, and risk patterns to identify intervention priorities."
        action={
          <GenerateReportButton
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          />
        }
      />

      <ClusterFilters
        value={draftFilters}
        filterOptions={filterOptions}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <section aria-label="Cluster summaries" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Cluster summaries
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Grouping overview based on the active filters.
          </p>
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex h-32 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
          </div>
        ) : (
          <ClusterSummaryList clusters={clustersWithColor} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Cluster visualization
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Compare behavior and attendance patterns, then select a
                  student.
                </p>
              </div>

              <ClusterViewTabs
                tabs={viewTabs}
                value={activeView}
                onChange={setActiveView}
              />
            </div>

            <div className="pt-6">
              {isLoading ? (
                <div className="flex h-72 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
                </div>
              ) : activeView === "scatter" ? (
                <ClusterScatterPanel
                  students={students}
                  clusters={clustersWithColor}
                  selectedStudentId={activeStudentId}
                  onSelectStudent={setSelectedStudentId}
                />
              ) : (
                <ClusterTablePanel
                  students={students}
                  selectedStudentId={activeStudentId}
                  clusters={clustersWithColor}
                  onSelectStudent={setSelectedStudentId}
                />
              )}
            </div>
          </div>
        </div>

        <ClusterDetailsPanel
          student={selectedStudent}
          isLoading={isLoadingStudent}
        />
      </section>
    </main>
  );
}

export default StudentClusteringPage;
