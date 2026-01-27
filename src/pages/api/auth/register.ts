import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import { pool } from "../../../lib/db.js";

function isValidPassword(pass: string) {
  // 8+ con mayúscula, minúscula y número
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(pass);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const nombre = String(body?.nombre ?? "").trim();
    const pass = String(body?.pass ?? "");

    if (!nombre || nombre.length < 2) {
      return new Response(JSON.stringify({ ok: false, message: "Usuario inválido." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isValidPassword(pass)) {
      return new Response(JSON.stringify({ ok: false, message: "Contraseña inválida." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ revisa si ya existe
    const exist = await pool.query("SELECT 1 FROM usuariossimu WHERE nombre = $1 LIMIT 1", [nombre]);
    if (exist.rowCount && exist.rowCount > 0) {
      return new Response(JSON.stringify({ ok: false, message: "Usuario ya existe." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hash = await bcrypt.hash(pass, 10);
    await pool.query("INSERT INTO usuariossimu (nombre, pass) VALUES ($1, $2)", [nombre, hash]);

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
