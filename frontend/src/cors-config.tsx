import axios from "axios";

// configura o Cross-Origin Resource Sharing
const instance = axios.create({
  baseURL: "http://localhost:3001",
});

export default instance;
