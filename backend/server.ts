import express, { json } from "express";
import cors from "cors";
import { loginQuery, signinQuery, loginSession } from "./database.ts";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;

// iniciar backend
var app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const PORT = 3001;

// rotas
// tentar login
app.post("/attempt_login", async (req, res) => {
  const { userEmail, userPassword } = req.body.data;
  const data = await loginQuery(userEmail, userPassword);

  if (data != null && typeof data === "object") {
    try {
      const usernameToAuth = data[0];
      const userIdToAuth = data[1];
      const authToken = jwt.sign(
        { usernameToAuth: usernameToAuth },
        process.env.JWT_AUTH_TOKEN!,
        {
          expiresIn: "10m",
        },
      );
      const refreshToken = jwt.sign(
        { usernameToAuth: usernameToAuth },
        process.env.JWT_REFRESH_TOKEN!,
        {
          expiresIn: "1d",
        },
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: false,
        })
        .send({ authToken: authToken, userIdToAuth: userIdToAuth });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("senha ou usuario incorreto");
  }
});

// registrar sessão após login
app.post("/login_session", async (req, res) => {
  const { userId, userAuth } = req.body.data;
  const userRefresh = req.cookies.refreshToken;
  try {
    await loginSession(userId, userAuth, userRefresh);
    console.log("sessao criada yay");
  } catch (error) {
    console.log(error);
  }
});

// testar login
app.get("/check_session", async (req, res) => {
  const data = req.cookies.refreshToken;
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
