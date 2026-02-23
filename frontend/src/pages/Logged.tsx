import instance from "../cors-config";
import { useState } from "react";
import { useEffect } from "react";

function Logged() {
  // título da página
  useEffect(() => {
    document.title = "Testar sessão";
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

  return (
    <>
      <div>
        <p>{session}</p>

        <button onClick={getSession}>Sair</button>
      </div>
    </>
  );
}

export default Logged;
