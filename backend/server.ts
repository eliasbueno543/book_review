import express, { json } from "express";
import cors from "cors";
import {
  loginQuery,
  signinQuery,
  loginSession,
  destroySession,
} from "./database.ts";
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
    methods: ["GET", "PUT", "POST", "DELETE"],
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

      ////

      try {
        await loginSession(userIdToAuth, authToken, refreshToken);
        console.log("sessao criada yay");
      } catch (error) {
        console.log(error);
      } finally {
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: false,
          })
          .cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            sameSite: false,
          })
          .end();
      }

      ////
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("senha ou usuario incorreto");
  }
});

/* registrar sessão após login
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
*/

// autenticar

const authenticateSession = async (req: any, res: any, next: any) => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN!,
    function (err: any, decoded: any) {
      if (err) {
        console.log(err.name + " " + err.expiredAt);
        console.log("refreshToken inválido");

        return res
          .clearCookie("refreshToken")
          .clearCookie("authToken")
          .format({
            json: () =>
              res.status(403).json({
                error: "You must login to see this",
                location: "http://localhost:3000",
              }),
            html: () => res.redirect("http://localhost:3000"),
            default: () => res.redirect("http://localhost:3000"),
          });
      } else {
        jwt.verify(
          authToken,
          process.env.JWT_AUTH_TOKEN!,
          function (err: any, decoded: any) {
            if (err) {
              console.log(err.name + " " + err.expiredAt);
              console.log("authToken inválido");
              return res.end("authToken inválido");
            } else {
              console.log("authToken válido");
              next();
            }
          },
        );
      }
    },
  );
};

// testar login
app.get("/check_session", authenticateSession, async (req, res) => {
  const data = req.cookies.refreshToken;
  console.log(data);
  res.send(data);
});

// testar logout
app.delete("/logout", async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;
  const data = await destroySession(userRefreshToken);

  console.log(data);

  res.clearCookie("refreshToken").clearCookie("authToken").end();
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
