import instance from "../cors-config";
import { useState } from "react";

function Logged() {
  const [session, changeSession] = useState("no");

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
          // apos autenticar, loga o ID referente aos dados preenchidos
          // (temporário, apenas verificando funcionamento)
          console.log(`session: ${res.data}`);
          changeSession(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // valores dos campos mudam conforme o cliente os preenche
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
