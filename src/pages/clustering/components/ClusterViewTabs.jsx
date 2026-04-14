import { SegmentedTabs } from "./ClusterUi";

function ClusterViewTabs({ tabs, value, onChange }) {
  return (
    <SegmentedTabs
      tabs={tabs}
      value={value}
      onChange={onChange}
      ariaLabel="Cluster visualization view"
    />
  );
}

export default ClusterViewTabs;
