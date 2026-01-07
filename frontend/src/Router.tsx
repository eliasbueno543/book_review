import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

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
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default Router;
