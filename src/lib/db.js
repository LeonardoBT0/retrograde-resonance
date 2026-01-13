import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1
});
