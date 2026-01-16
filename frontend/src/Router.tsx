import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Logged from "./pages/Logged";

function Router() {
  // redireciona para pagina de login ao tentar entrar na root
  // (temporario, redirecionara apenas se nao tiver logado, implementado com JWT)
  // define quais componentes renderizam em cada rota
  return (
    <>
      {window.location.pathname === "/" ? (
        window.location.assign("login")
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/check_session" element={<Logged />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default Router;
