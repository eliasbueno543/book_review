import express, { json } from "express";
import cors from "cors";
import {
  loginQuery,
  signinQuery,
  loginSession,
  destroySession,
  authUpdate,
} from "./database.ts";
import cookieParser from "cookie-parser";
import jsonwebtoken, { type Jwt } from "jsonwebtoken";
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
              res.status(403).json({
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
          function (err: any, decoded: any) {
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
              // authToken válido, prossegue com a request (adicionar autenticação de sessão, copia e cola praticamente)
              console.log("AuthToken válido.");
              next();
            }
          },
        );
      }
    },
  );
};

// rotas
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

  res.clearCookie("refreshToken").clearCookie("authToken").end();
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
