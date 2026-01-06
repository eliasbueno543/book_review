import instance from "../cors-config";
import { useState } from "react";

function Login() {
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");

  const request_login = async () => {
    try {
      await instance
        .post("attempt_login", {
          "Content-Type": "application/json",
          data: {
            user_email,
            user_password,
          },
        })
        .then(function (res) {
          console.log(`cl: ${res.data}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label>E-mail</label>
      <input
        type="text"
        placeholder="email"
        id="user_email"
        value={user_email}
        onChange={(e) => setUserEmail(e.target.value)}
      ></input>
      <br />

      <label>Senha</label>
      <input
        type="text"
        placeholder="senha"
        id="user_senha"
        value={user_password}
        onChange={(e) => setUserPassword(e.target.value)}
      ></input>
      <br />

      <button onClick={request_login}>Entrar</button>
    </>
  );
}

export default Login;
