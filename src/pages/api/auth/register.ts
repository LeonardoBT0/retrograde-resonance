import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import { pool } from "../../../lib/db.js";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const nombre = String(body?.nombre ?? "").trim();
    const pass = String(body?.pass ?? "");

    if (!nombre || !pass) {
      return new Response(JSON.stringify({ ok: false, message: "Datos incompletos." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash (bcrypt ~60 chars, cabe en VARCHAR(100))
    const hash = await bcrypt.hash(pass, 10);

    await pool.query(
      "INSERT INTO usuariossimu (nombre, pass) VALUES ($1, $2)",
      [nombre, hash]
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("register error:", err);
    return new Response(JSON.stringify({ ok: false, message: "No se pudo registrar." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
