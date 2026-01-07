import { Pool } from "pg";

// conexao com banco de dados
const pool = new Pool({
  connectionString: process.env.PG_URL,
});

// autenticar login (temporario, apenas para testar funcionalidade, eventualmente usara JWT)
const loginQuery = async (user_email: string, user_password: string) => {
  const sql = `SELECT * FROM users WHERE email='${user_email}' AND password='${user_password}'`;
  const client = await pool.connect();
  const query = await client.query(sql);
  const res = query.rows[0].user_id;
  return res;
};

export default loginQuery;
