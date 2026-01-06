import express, { urlencoded } from "express";
import cors from "cors";
import loginQuery from "./database.ts";
import { parseJsonSourceFileConfigFileContent } from "typescript";

// iniciar backend
var app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// rotas
// login
app.post("/attempt_login", async (req, res) => {
  const { user_email, user_password } = req.body.data;
  const data = await loginQuery(user_email, user_password);
  console.log(`sv: ${data}`);
  res.send(data);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server iniciado em localhost/${PORT}`);
  }
});
