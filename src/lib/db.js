import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: import.meta.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
