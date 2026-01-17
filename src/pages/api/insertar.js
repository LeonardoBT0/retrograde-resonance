import { pool } from "../../lib/db.js";

export const prerender = false;

export async function POST() {
  try {
    await pool.query(
      "INSERT INTO usuarios (nombre, apellidos) VALUES ($1, $2)",
      ["Prueba", "Astro"]
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
