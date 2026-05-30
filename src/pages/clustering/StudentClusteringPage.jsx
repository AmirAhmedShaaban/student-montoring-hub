import { useMemo, useState } from "react";
import { useDashboardMockData } from "../../mocks/dashboard.mock";
import { clusteringMockData } from "../../mocks/clustering.mock";

import ClusterDetailsPanel from "./components/ClusterDetailsPanel";
import ClusterFilters from "./components/ClusterFilters";
import ClusterPageHeader from "./components/ClusterPageHeader";
import ClusterScatterPanel from "./components/ClusterScatterPanel";
import ClusterSummaryList from "./components/ClusterSummaryList";
import ClusterTablePanel from "./components/ClusterTablePanel";
import ClusterViewTabs from "./components/ClusterViewTabs";
import GenerateReportButton from "./components/GenerateReportButton";

const initialFilters = {
  dateRange: "last-90-days",
  schoolYear: "2025-2026",
  gradeLevel: "all",
};

function average(values, key) {
  if (values.length === 0) {
    return null;
  }

  return (
    values.reduce((sum, item) => sum + Number(item[key] ?? 0), 0) /
    values.length
  );
}

function StudentClusteringPage() {
  const dashboardData = useDashboardMockData();
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [activeView, setActiveView] = useState("scatter");
  const [selectedStudentId, setSelectedStudentId] = useState(
    clusteringMockData.defaultSelectedStudentId,
  );

  const visibleStudents = useMemo(() => {
    return clusteringMockData.students.filter((student) => {
      const matchesDateRange = student.dateRangeKeys.includes(
        appliedFilters.dateRange,
      );
      const matchesSchoolYear =
        student.schoolYear === appliedFilters.schoolYear;
      const matchesGradeLevel =
        appliedFilters.gradeLevel === "all" ||
        student.gradeLevel === appliedFilters.gradeLevel;

      return matchesDateRange && matchesSchoolYear && matchesGradeLevel;
    });
  }, [appliedFilters]);

  const activeStudentId = useMemo(() => {
    if (visibleStudents.length === 0) {
      return null;
    }

    const selectedVisibleStudent = visibleStudents.find(
      (student) => student.id === selectedStudentId,
    );

    return selectedVisibleStudent?.id ?? visibleStudents[0].id;
  }, [selectedStudentId, visibleStudents]);

  const selectedStudent = useMemo(() => {
    return (
      visibleStudents.find((student) => student.id === activeStudentId) ?? null
    );
  }, [activeStudentId, visibleStudents]);

  const clusterSummaries = useMemo(() => {
    return clusteringMockData.clusters.map((cluster) => {
      const clusterStudents = visibleStudents.filter(
        (student) => student.clusterId === cluster.id,
      );

      return {
        ...cluster,
        studentCount: clusterStudents.length,
        avgAttendance: average(clusterStudents, "attendanceRate"),
        avgGrade: average(clusterStudents, "gradeAverage"),
      };
    });
  }, [visibleStudents]);

  const viewTabs = [
    { id: "scatter", label: "Scatter view" },
    { id: "table", label: "Table view" },
  ];

  const handleFilterChange = (field, value) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <ClusterPageHeader
        title="Student Clustering"
        subtitle="Group students by behavior, attendance, and risk patterns to identify intervention priorities."
        action={<GenerateReportButton />}
      />

      <ClusterFilters
        value={draftFilters}
        filterOptions={clusteringMockData.filters}
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

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Recent review: {dashboardData.latestAnalysisResult.classification} in{" "}
          {dashboardData.latestAnalysisResult.cluster} with{" "}
          {dashboardData.latestAnalysisResult.riskLevel.toLowerCase()} risk.
        </div>

        <ClusterSummaryList clusters={clusterSummaries} />
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
                  Compare behavior and attendance patterns, then select a student.
                </p>
              </div>

              <ClusterViewTabs
                tabs={viewTabs}
                value={activeView}
                onChange={setActiveView}
              />
            </div>

            <div className="pt-6">
              {activeView === "scatter" ? (
                <ClusterScatterPanel
                  students={visibleStudents}
                  clusters={clusteringMockData.clusters}
                  selectedStudentId={activeStudentId}
                  onSelectStudent={setSelectedStudentId}
                />
              ) : (
                <ClusterTablePanel
                  students={visibleStudents}
                  selectedStudentId={activeStudentId}
                  clusters={clusteringMockData.clusters}
                  onSelectStudent={setSelectedStudentId}
                />
              )}
            </div>
          </div>
        </div>

        <ClusterDetailsPanel student={selectedStudent} />
      </section>
    </main>
  );
}

export default StudentClusteringPage;
