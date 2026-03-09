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

  // interface de login e sigin
  function MainScreenBox(props: { opType: string }) {
    let opType = props.opType;

    return (
      <>
        <div className="h-[65%] w-md p-8 border-4 border-indigo-600">
          <label>E-mail</label>
          <input
            type="text"
            placeholder={opType + " email"}
            //id="user_email"
            id={opType + "_email"}
            //value={userEmail}
            value={opType == "user" ? userEmail : signinEmail}
            //onChange={(e) => setUserEmail(e.target.value)}
            onChange={(e) =>
              opType == "user"
                ? setUserEmail(e.target.value)
                : setSigninEmail(e.target.value)
            }
          ></input>
          <br />

          <label>Senha</label>
          <input
            type="text"
            placeholder={opType + "senha"}
            id={opType + "_senha"}
            value={opType == "user" ? userPassword : signinPassword}
            onChange={(e) =>
              opType == "user"
                ? setUserPassword(e.target.value)
                : setSigninPassword(e.target.value)
            }
          ></input>
          <br />

          <button onClick={opType == "user" ? requestLogin : requestSignin}>
            {opType == "user" ? "Entrar" : "Cadastrar"}
          </button>
        </div>
      </>
    );
  }

  // valores dos campos mudam conforme o cliente os preenche
  return (
    <>
      <div className="flex w-dvw h-dvh justify-center items-center border-4 border-red-600">
        {/* funcao de login */}
        <MainScreenBox opType="user" />
        <MainScreenBox opType="signin" />
      </div>
    </>
  );
}

export default Login;
