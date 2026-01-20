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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log completo solo en el servidor (Vercel / consola)
    console.error("API /insertar error:", error);

    // Respuesta segura al cliente (sin filtrar detalles)
    return new Response(
      JSON.stringify({
        ok: false,
        publicMessage: "No se pudo insertar el registro. Intenta nuevamente.",
        code: "E_DB_INSERT",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
