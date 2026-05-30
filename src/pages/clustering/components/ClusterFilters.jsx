import { Button, Card, SelectField, SectionHeader } from "./ClusterUi";

function ClusterFilters({ value, filterOptions, onChange, onApply, onReset }) {
  return (
    <Card>
      <SectionHeader
        title="Filters"
        description="Refine the cluster view by monitoring window, school year, and grade level."
        action={
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={onReset}>
              Reset
            </Button>
            <Button type="submit" form="cluster-filters-form">
              Apply filters
            </Button>
          </div>
        }
      />

      <form id="cluster-filters-form" className="pt-5" onSubmit={onApply}>
        <div className="grid gap-4 lg:grid-cols-3">
          <SelectField
            id="cluster-date-range"
            label="Date range"
            value={value.dateRange}
            onChange={(event) => onChange("dateRange", event.target.value)}
            options={filterOptions.dateRanges}
          />
          <SelectField
            id="cluster-school-year"
            label="School year"
            value={value.schoolYear}
            onChange={(event) => onChange("schoolYear", event.target.value)}
            options={filterOptions.schoolYears}
          />
          <SelectField
            id="cluster-grade-level"
            label="Grade level"
            value={value.gradeLevel}
            onChange={(event) => onChange("gradeLevel", event.target.value)}
            options={filterOptions.gradeLevels}
          />
        </div>
      </form>
    </Card>
  );
}

export default ClusterFilters;
