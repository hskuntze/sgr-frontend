import { Route, Routes } from "react-router-dom";
import Reports from "./Reports";

const Acompanhamento = () => {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
    </Routes>
  );
};

export default Acompanhamento;
