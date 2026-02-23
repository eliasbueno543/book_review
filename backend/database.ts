import { Pool } from "pg";
import bcrypt from "bcryptjs";

// conexao com banco de dados
const pool = new Pool({
  connectionString: process.env.PG_URL,
});

// autenticar login
export async function loginQuery(userEmail: string, userPassword: string) {
  const sql = "SELECT * FROM users WHERE email=$1";
  const sqlValues = [userEmail];
  const client = await pool.connect();
  const query = await client.query(sql, sqlValues);
  var res: any[] | null;
  const rowcount = query.rowCount;

  if (rowcount === 1) {
    if (await bcrypt.compare(userPassword, query.rows[0].password)) {
      res = [query.rows[0].username, query.rows[0].user_id];
    } else {
      res = null;
    }
  } else {
    res = null;
  }

  client.release();
  return res;
}

// criar sessao em banco de dados após login
export async function loginSession(
  sessionUser: string,
  authToken: string,
  refreshToken: string,
) {
  try {
    const client = await pool.connect();
    const sqlQuery = `INSERT INTO sessions("session_user", session_auth, session_refresh) VALUES ($1, $2, $3) RETURNING *`;
    const sqlValues = [parseInt(sessionUser), authToken, refreshToken];
    const queryCount = await client.query(sqlQuery, sqlValues);
    const rowcount = queryCount.rowCount;

    if (rowcount !== 0) {
      console.log("Sessão criada em banco de dados.");
    } else {
      console.log("Algo de inesperado aconteceu ocorreu.");
    }

    client.release();
  } catch (error) {
    console.log(error);
  }
}

// autenticar usuario logado
export async function authSession(authToken: string, refreshToken: string) {
  const sql =
    "SELECT * FROM sessions WHERE session_auth=$1 AND session_refresh=$2";
  const sqlValues = [authToken, refreshToken];
  const client = await pool.connect();
  const query = await client.query(sql, sqlValues);
  const rowcount = query.rowCount;
  client.release();

  if (rowcount === 1) {
    return true;
  } else {
    return false;
  }
}

// atualizar token de autenticação caso sessão seja válida
export async function authUpdate(
  newAuthToken: string,
  authToken: string,
  refreshToken: string,
) {
  try {
    const client = await pool.connect();
    const sqlQuery = `UPDATE sessions SET session_auth=$1 WHERE session_auth=$2 AND session_refresh=$3 RETURNING *`;
    const sqlValues = [newAuthToken, authToken, refreshToken];
    const queryCount = await client.query(sqlQuery, sqlValues);
    const rowcount = queryCount.rowCount;

    if (rowcount == 1) {
      console.log("AuthToken atualizado.");
    } else {
      console.log("Algo de inesperado aconteceu ocorreu.");
    }

    client.release();
  } catch (error) {
    console.log(error);
  }
}

// destruir sessão em banco de dados em caso de logout
export async function destroySession(
  refreshToken: string /*,  userId: number*/,
) {
  var sqlQuery = `SELECT session_id FROM sessions WHERE session_refresh=$1`; // AND session_user=$1
  var sqlValues = [refreshToken]; // userId
  const client = await pool.connect();
  const sessionToDelete = await client.query(sqlQuery, sqlValues);

  const rowcount = sessionToDelete.rowCount;
  var res: string;

  if (rowcount !== 0) {
    sqlQuery = `DELETE FROM sessions WHERE session_id=$1 RETURNING "session_id"`;
    sqlValues = [sessionToDelete.rows[0].session_id];
    const sessionDeleted = await client.query(sqlQuery, sqlValues);

    if (sessionDeleted.rows[0].session_id !== null) {
      res = "Sessão " + sessionDeleted.rows[0].session_id + " encerrada.";
    } else {
      res = "Algo de inesperado aconteceu ocorreu.";
    }

    client.release();
    return res;
  } else {
    console.log("Nenhuma sessão com os dados fornecidos foi encontrada.");
    client.release();
  }
}

// cadastro de novo usuário no banco de dados (eventualmente tera sanitização e resposta ao cliente)
export async function signinQuery(userEmail: string, userPassword: string) {
  const sqlCount = `SELECT * FROM users WHERE email=$1`;
  const sqlCountValues = [userEmail];
  const client = await pool.connect();
  const queryCount = await client.query(sqlCount, sqlCountValues);
  var res: string | string[];

  const rowcount = queryCount.rowCount;
  if (rowcount !== 0) {
    res = "Usuário já existe.";
  } else {
    // salt pata cryptografia
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT!));
    const userPasswordHash = await bcrypt.hash(userPassword, salt);
    const sqlCreate = `INSERT INTO users(email, password, username) VALUES ($1, $2, $3) RETURNING *`;
    const sqlCreateValues = [userEmail, userPasswordHash, userEmail];
    const queryCreate = await client.query(sqlCreate, sqlCreateValues);
    res = queryCreate.rows[0];
    console.log(res);
  }

  client.release();
  return res;
}
