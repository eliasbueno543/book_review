import express, { json } from "express";
import cors from "cors";
import {
  loginQuery,
  signinQuery,
  loginSession,
  destroySession,
  authSession,
  authUpdate,
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
const frontendBaseUrl = "http://localhost:3000";

// middleware para autenticar request
const authenticateSession = async (req: any, res: any, next: any) => {
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;

  // verifica se refreshToken/sessão é válida
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN!,
    function (err: any, decoded: any) {
      if (err) {
        console.log(err.name + " " + err.expiredAt);
        console.log("RefreshToken inválido.");

        // limpa os cookies da request, retorna um erro
        return res
          .clearCookie("refreshToken")
          .clearCookie("authToken")
          .format({
            json: () =>
              res.status(401).json({
                error:
                  "Por favor, entre com seu usuário e senha para acessar esse conteúdo.",
                location: "http://localhost:3000",
              }),
            html: () => res.redirect("http://localhost:3000"),
            default: () => res.redirect("http://localhost:3000"),
          });
      } else {
        // refreshToken, verifica se o authToken é válido
        jwt.verify(
          authToken,
          process.env.JWT_AUTH_TOKEN!,
          async function (err: any, decoded: any) {
            if (err) {
              console.log(err.name + " " + err.expiredAt);
              console.log("AuthToken inválido, tentando gerar um novo.");

              try {
                const decodedAuthToken = jwt.decode(authToken, {
                  json: true,
                });

                const newPayload = decodedAuthToken!.usernameToAuth;

                const newAuthToken = jwt.sign(
                  { newPayload: newPayload },
                  process.env.JWT_AUTH_TOKEN!,
                  {
                    expiresIn: "10m", // production
                    // expiresIn: "1m", // testing
                  },
                );

                // autentica sessão, atualiza o authToken no banco de dados, atualiza o cookie com authToken no frontend
                authUpdate(newAuthToken, authToken, refreshToken).then(
                  res.cookie("authToken", newAuthToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: false,
                  }),
                );

                // tenta executar a request novamente com o novo authToken
                var newReq = req;
                newReq.cookies.authToken = newAuthToken;
                return authenticateSession(newReq, res, next);
              } catch (error) {
                console.log(error);
              }
            } else {
              // authToken válido, tenta autenticar sessão
              console.log("AuthToken válido.");

              // sessão válida
              if ((await authSession(authToken, refreshToken)) === true) {
                next();
              } else {
                // sessão inválida
                return res
                  .clearCookie("refreshToken")
                  .clearCookie("authToken")
                  .format({
                    json: () =>
                      res.status(401).json({
                        error:
                          "Por favor, entre com seu usuário e senha para acessar esse conteúdo.",
                        location: "http://localhost:3000/login",
                      }),
                    html: () => res.redirect("http://localhost:3000/login"),
                    default: () => res.redirect("http://localhost:3000/login"),
                  });
              }
            }
          },
        );
      }
    },
  );
};

// rotas
// verificar se sessão existe ao entrar na página e ao fim de chamadas
app.post("/check_loggedin", async (req, res) => {
  // captura tokens (caso existam) e a URL que mandou a request
  const authToken = req.cookies.authToken;
  const refreshToken = req.cookies.refreshToken;
  const { clientUrl } = req.body.data;

  try {
    // se o usuário existe, se estiver na página de login, redireciona para página principal
    if ((await authSession(authToken, refreshToken)) === true) {
      if (clientUrl === "/login") {
        res.format({
          json: () =>
            res.status(403).json({
              error: "Usuário logado. Redirecionando.",
              location: "http://localhost:3000/check_session",
            }),
          html: () => res.redirect("http://localhost:3000/check_session"),
          default: () => res.redirect("http://localhost:3000/check_session"),
        });
      } else {
        res.status(204).end();
      }
    } else {
      // se o não usuário existe, redireciona para a página de login caso não esteja nela
      if (clientUrl !== "/login") {
        res.format({
          json: () =>
            res.status(401).json({
              error:
                "Usuário deslogado ou não identificado. Favor, entre novamente.",
              location: "http://localhost:3000/login",
            }),
          html: () => res.redirect("http://localhost:3000/login"),
          default: () => res.redirect("http://localhost:3000/login"),
        });
      } else {
        res.status(204).end();
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// login
app.post("/attempt_login", async (req, res) => {
  const { userEmail, userPassword } = req.body.data;

  // autentica usuário e senha
  const data = await loginQuery(userEmail, userPassword);

  if (data != null && typeof data === "object") {
    try {
      const usernameToAuth = data[0];
      const userIdToAuth = data[1];
      const authToken = jwt.sign(
        { usernameToAuth: usernameToAuth },
        process.env.JWT_AUTH_TOKEN!,
        {
          expiresIn: "10m", // production
          // expiresIn: "1m", // testing
        },
      );
      const refreshToken = jwt.sign(
        { usernameToAuth: usernameToAuth },
        process.env.JWT_REFRESH_TOKEN!,
        {
          expiresIn: "1d",
        },
      );

      // cria sessão, envia JWTs
      try {
        await loginSession(userIdToAuth, authToken, refreshToken);
      } catch (error) {
        console.log(error);
      } finally {
        res
          .status(200)
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

      //
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Senha e/ou usuário incorretos.");
  }
});

// teste de login válido
app.get("/check_session", authenticateSession, async (req, res) => {
  const data = req.cookies.authToken;
  console.log(data);
  res.send(data);
});

// logout
app.delete("/logout", authenticateSession, async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;
  const data = await destroySession(userRefreshToken);

  console.log(data);

  res.status(204).clearCookie("refreshToken").clearCookie("authToken").end();
});

// cadastro/signin
app.post("/attempt_signin", async (req, res) => {
  const { signinEmail, signinPassword } = req.body.data;
  const data = await signinQuery(signinEmail, signinPassword);
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
