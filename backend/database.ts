import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

const loginQuery = async (user_email: string, user_password: string) => {
  const sql = `SELECT * FROM users WHERE email='${user_email}' AND password='${user_password}'`;
  const client = await pool.connect();
  const query = await client.query(sql);
  const res = query.rows[0].user_id;
  console.log(`db: ${res}`);
  return res;
};

export default loginQuery;
