import instance from "../cors-config";
import { useState } from "react";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // envia uma requisicao com os campos preenchidos para o backend autenticar
  const requestLogin = async () => {
    try {
      await instance
        .post("attempt_login", {
          "Content-Type": "application/json",
          data: {
            userEmail,
            userPassword,
          },
        })
        .then(function (res) {
          // apos autenticar, loga o ID referente aos dados preenchidos
          // (temporário, apenas verificando funcionamento)
          console.log(`cl: ${res.data}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // valores dos campos mudam conforme o cliente os preenche
  return (
    <>
      <label>E-mail</label>
      <input
        type="text"
        placeholder="email"
        id="user_email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      ></input>
      <br />

      <label>Senha</label>
      <input
        type="text"
        placeholder="senha"
        id="user_senha"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
      ></input>
      <br />

      <button onClick={requestLogin}>Entrar</button>
    </>
  );
}

export default Login;
