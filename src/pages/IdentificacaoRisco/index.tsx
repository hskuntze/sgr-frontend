import { Route, Routes } from "react-router-dom";
import IdentificacaoRiscoList from "./List";
import IdentificacaoRiscoForm from "./Form";
import IdentificacaoRiscoInspect from "./Inspect";
import IdentificacaoRiscoHistory from "./History";
import "./styles.css";

const IdentificacaoRisco = () => {
  return (
    <section>
      <Routes>
        <Route path="/" element={<IdentificacaoRiscoList />}/>
        <Route path=":id" element={<IdentificacaoRiscoForm />} />
        <Route path="/visualizar/:id" element={<IdentificacaoRiscoInspect />} />
        <Route path="/historico/:id" element={<IdentificacaoRiscoHistory />} />
      </Routes>
    </section>
  );
};

export default IdentificacaoRisco;
