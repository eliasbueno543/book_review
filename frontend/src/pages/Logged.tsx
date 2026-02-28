import instance from "../frontToBackComm";
import { checkLoggedIn } from "../frontToBackComm";
import { useState, useEffect } from "react";

function Logged() {
  // on load da página
  useEffect(() => {
    document.title = "Testar sessão";

    // verifica estado atual da sessão ao abrir a página
    checkLoggedIn();
  });

  // valor a ser exibido
  const [session, changeSession] = useState("no");

  // verifica a sessão atual
  const getSession = async () => {
    try {
      await instance
        .get("check_session", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (res) {
          // apos autenticar, loga o token referente à sessão atual
          // console.log(`session: ${res.data}`);
          changeSession(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // envia uma request de logout
  const requestLogout = async () => {
    try {
      await instance
        .delete("logout", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(checkLoggedIn);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <p>{session}</p>

        <button onClick={getSession}>Sair</button>
      </div>

      <span>//////////////////////</span>

      {/* funcao de logout */}
      <div>
        <button onClick={requestLogout}>logout</button>
      </div>
    </>
  );
}

export default Logged;
