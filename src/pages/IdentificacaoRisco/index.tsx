import { Route, Routes } from "react-router-dom";
import IdentificacaoRiscoList from "./List";
import IdentificacaoRiscoForm from "./Form";

const IdentificacaoRisco = () => {
  return (
    <section>
      <Routes>
        <Route path="/" element={<IdentificacaoRiscoList />}/>
        <Route path=":id" element={<IdentificacaoRiscoForm />} />
      </Routes>
    </section>
  );
};

export default IdentificacaoRisco;
