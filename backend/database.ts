import { Pool } from "pg";
import bcrypt from "bcryptjs";

// conexao com banco de dados
const pool = new Pool({
  connectionString: process.env.PG_URL,
});

// autenticar login (temporario, apenas para testar funcionalidade, eventualmente usara JWT)
export async function loginQuery(userEmail: string, userPassword: string) {
  const sql = "SELECT user_id, password FROM users WHERE email=$1";
  const sqlValues = [userEmail];
  const client = await pool.connect();
  const query = await client.query(sql, sqlValues);
  var res: string;
  const rowcount = query.rowCount;

  if (rowcount === 1) {
    if (await bcrypt.compare(userPassword, query.rows[0].password)) {
      res = query.rows[0].user_id;
    } else {
      res = "senha incorreta";
    }
  } else {
    res = "user incorreto";
  }

  client.release();
  return res;
}

// tentar signin (temporario?, apenas para testar funcionalidade, eventualmente tera sanitização e resposta ao cliente)
export async function signinQuery(userEmail: string, userPassword: string) {
  const sqlCount = `SELECT * FROM users WHERE email=$1`;
  const sqlCountValues = [userEmail];
  const client = await pool.connect();
  const queryCount = await client.query(sqlCount, sqlCountValues);
  var res: string | string[];

  const rowcount = queryCount.rowCount;
  if (rowcount !== 0) {
    res = "já existe";
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
