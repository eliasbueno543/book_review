import express from "express";
import cors from "cors";
import { loginQuery, signinQuery } from "./database.ts";

// iniciar backend
var app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// rotas
// tentar login
app.post("/attempt_login", async (req, res) => {
  const { userEmail, userPassword } = req.body.data;
  const data = await loginQuery(userEmail, userPassword);
  res.send(data);
});

// tentar signin
app.post("/attempt_signin", async (req, res) => {
  const { userEmail, userPassword } = req.body.data;
  const data = await signinQuery(userEmail, userPassword);
  res.send(data);
});

// iniciar backend
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server iniciado em localhost/${PORT}`);
  }
});
