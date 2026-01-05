import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

const makeQuery = async () => {
  const sql = "SELECT * FROM users";
  const client = await pool.connect();
  const query = await client.query(sql);
  const res = query.rows;
  console.log(res);
};

export default makeQuery;
