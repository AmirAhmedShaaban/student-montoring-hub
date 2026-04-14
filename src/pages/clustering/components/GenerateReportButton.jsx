import { Button } from "./ClusterUi";

function GenerateReportButton({ onClick }) {
  return (
    <Button type="button" onClick={onClick}>
      Generate cluster report
    </Button>
  );
}

export default GenerateReportButton;
