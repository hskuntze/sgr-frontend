import Navbar from "components/Navbar";
import Admin from "pages/Admin";
import Auth from "pages/Auth";
import Confirmar from "pages/Confirmar";
import Home from "pages/Home";
import IdentificacaoRisco from "pages/IdentificacaoRisco";
import NaoEncontrado from "pages/NaoEncontrado";
import OMs from "pages/OM";
import PrivateRoute from "PrivateRoute";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { isAuthenticated } from "utils/auth";

/**
 * Componente que controla as rotas da aplicação.
 * O prefixo definido para as rotas é "/sgr".
 * Utiliza o BrowserRouter, comum para aplicações web
 * e SPA (Single Page Applications), sendo capaz de
 * gerenciar o histórico de navegação.
 */
const Routes = () => {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/sgr" />} />
          <Route path="/sgr/*" element={<Auth />} />
          <Route path="/sgr/confirmado" element={<Confirmar />} />
          <Route path="/sgr/nao-encontrado" element={<NaoEncontrado />} />
          <Route
            path="/sgr"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgr/usuario/*"
            element={
              <PrivateRoute roles={[{ id: 1, autorizacao: "PERFIL_ADMIN" }]}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgr/om/*"
            element={
              <PrivateRoute roles={[{ id: 1, autorizacao: "PERFIL_ADMIN" }]}>
                <OMs />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgr/identificacaoriscos/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <IdentificacaoRisco />
              </PrivateRoute>
            }
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
