import ClusterSummaryCard from "./ClusterSummaryCard";

function ClusterSummaryList({ clusters }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {clusters.map((cluster) => (
        <ClusterSummaryCard key={cluster.id} cluster={cluster} />
      ))}
    </div>
  );
}

export default ClusterSummaryList;
