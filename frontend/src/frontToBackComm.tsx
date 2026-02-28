import axios from "axios";

// cria comunicador front-backend
const instance = axios.create({
  baseURL: "http://localhost:3001", // endereço do server
  withCredentials: true, // requests tem que ser seguras
});

// trata respostas do backend antes de devolver pro frontend
instance.interceptors.response.use(
  // tudo ok
  (res) => {
    return res;
  },

  // algo de errado ocorreu
  (err) => {
    // usuário não logado, sem acesso à essa página
    if (err.status === 401) {
      window.location = err.response.data.location; // redireciona para página inicial

      // usuário já logado, sem acesso à esta página
    } else if (err.status === 403) {
      window.location = err.response.data.location; // redireciona para página inicial de usuário logado

      // resposta padrão, nega a request
    } else {
      return Promise.reject(err);
    }
  },
);

export default instance;

//
// verificar se sessão existe ao entrar na página e ao fim de chamadas
export const checkLoggedIn = async () => {
  const clientUrl = window.location.pathname;

  try {
    await instance
      .post("check_loggedin", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          clientUrl,
        },
      })
      .then();
  } catch (error) {
    console.log(error);
  }
};
