import ConjuntoSeveridadeReport from "./ConjuntoSeveridadeReport";
import RiscoSeveridadeReport from "./RiscoSeveridadeReport";

const Reports = () => {
  return (
    <div className="reports">
      <RiscoSeveridadeReport />
      <ConjuntoSeveridadeReport />
    </div>
  );
};

export default Reports;
