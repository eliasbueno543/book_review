import express from "express";
import cors from "cors";
import { loginQuery, signinQuery } from "./database.ts";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";

// iniciar backend
var app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const PORT = 3001;

// rotas
// tentar login
app.post("/attempt_login", async (req, res) => {
  const { userEmail, userPassword } = req.body.data;
  const data = await loginQuery(userEmail, userPassword);

  if (data != null) {
    try {
      res
        .cookie("user_id", data, {
          httpOnly: true,
          secure: true,
          sameSite: false,
        })
        .send(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("senha ou usuario incorreto");
  }
});

app.get("/check_session", async (req, res) => {
  const data = req.cookies.user_id;
  console.log(data);
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
