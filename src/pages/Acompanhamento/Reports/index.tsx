import ConjuntoSeveridadeReport from "./ConjuntoSeveridadeReport";
import RiscoSeveridadeReport from "./RiscoSeveridadeReport";
import "./styles.css";

const Reports = () => {
  return (
    <div className="reports">
      <h2>Riscos SAD 2/SISFRON</h2>
      <RiscoSeveridadeReport />
      <h2>Gráficos - Painel de Projetos</h2>
      <ConjuntoSeveridadeReport />
    </div>
  );
};

export default Reports;
