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
    // não existe sessão ativa
    if (err.status === 403) {
      window.location = err.response.data.location; // redireciona para página inicial

      // resposta padrão, nega a request
    } else {
      return Promise.reject(err);
    }
  },
);

export default instance;
