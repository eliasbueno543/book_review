import axios from "axios";

// configura o Cross-Origin Resource Sharing
const instance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// lidar com respostas falhas
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    // acesso negado
    if (err.status === 403) {
      window.location = err.response.data.location;
    } else {
      return Promise.reject(err);
    }
  },
);

export default instance;
