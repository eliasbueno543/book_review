import instance from "../frontToBackComm";
import { checkLoggedIn } from "../frontToBackComm";
import { useEffect, useState } from "react";

function Login() {
  // on load da página
  useEffect(() => {
    document.title = "Login";

    // verifica estado atual da sessão ao abrir a página
    checkLoggedIn();
  });

  // campos de login
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // campos de cadastro/signin
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // envia uma request de login com os campos preenchidos para o backend
  const requestLogin = async () => {
    try {
      await instance
        .post("attempt_login", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            userEmail,
            userPassword,
          },
        })
        .then(checkLoggedIn);
    } catch (error) {
      console.log(error);
    }
  };

  // envia uma request de cadastro com os campos preenchidos para o backend
  const requestSignin = async () => {
    try {
      await instance
        .post("attempt_signin", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            signinEmail,
            signinPassword,
          },
        })
        .then(
          //function (res) {
          // cria um novo usuario
          // console.log(`cl: ${JSON.stringify(res.data)}`);
          //}

          checkLoggedIn,
        );
    } catch (error) {
      console.log(error);
    }
  };

  // valores dos campos mudam conforme o cliente os preenche
  return (
    <>
      {/* funcao de login */}
      <div>
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
      </div>

      <span>//////////////////////</span>

      {/* funcao de cadastro */}
      <div>
        <label>E-mail</label>
        <input
          type="text"
          placeholder="email"
          id="user_email"
          value={signinEmail}
          onChange={(e) => setSigninEmail(e.target.value)}
        ></input>
        <br />

        <label>Senha</label>
        <input
          type="text"
          placeholder="senha"
          id="user_senha"
          value={signinPassword}
          onChange={(e) => setSigninPassword(e.target.value)}
        ></input>
        <br />

        <button onClick={requestSignin}>Criar</button>
      </div>
    </>
  );
}

export default Login;
