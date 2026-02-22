import instance from "../cors-config";
import { use, useState } from "react";
import { useEffect } from "react";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    document.title = "Login";
  });

  // envia uma requisicao com os campos preenchidos para o backend autenticar
  const requestLogin = async () => {
    try {
      await instance.post("attempt_login", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          userEmail,
          userPassword,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // envia uma requisicao com os campos preenchidos para o backend autenticar
  const requestSignin = async () => {
    try {
      await instance
        .post("attempt_signin", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            userEmail,
            userPassword,
          },
        })
        .then(function (res) {
          // cria um novo usuario
          console.log(`cl: ${JSON.stringify(res.data)}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // delete
  const logout = async () => {
    try {
      await instance.delete("logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // valores dos campos mudam conforme o cliente os preenche
  return (
    <>
      <div>
        {/* funcao de login*/}
        <label>E-mail</label>
        <input
          type="text"
          placeholder="email"
          id="user_email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        ></input>
        <br />

        {/* funcao de signin (temporario, migrar para outra aba eventualmente)*/}
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

        <button onClick={requestSignin}>Criar</button>
      </div>

      <span>//////////////////////</span>

      <div>
        <button onClick={logout}>logout</button>
      </div>
    </>
  );
}

export default Login;
