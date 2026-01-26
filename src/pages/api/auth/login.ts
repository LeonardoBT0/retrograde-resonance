import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import { pool } from "../../../lib/db.js";
import { createSession, SESSION_COOKIE } from "../../../lib/session";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const secret = import.meta.env.AUTH_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ ok: false, message: "Servicio no disponible.", code: "E_AUTH_CFG" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json().catch(() => ({}));
    const nombre = String(body?.nombre ?? "").trim();
    const pass = String(body?.pass ?? "");

    if (!nombre || !pass) {
      return new Response(JSON.stringify({ ok: false, message: "Datos incompletos.", code: "E_AUTH_DATA" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const r = await pool.query("SELECT id, pass FROM usuariossimu WHERE nombre = $1 LIMIT 1", [nombre]);
    if (r.rowCount === 0) {
      return new Response(JSON.stringify({ ok: false, message: "Credenciales inválidas.", code: "E_AUTH_BAD" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = r.rows[0];
    const ok = await bcrypt.compare(pass, user.pass);
    if (!ok) {
      return new Response(JSON.stringify({ ok: false, message: "Credenciales inválidas.", code: "E_AUTH_BAD" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sessionValue = createSession(secret, user.id);
    const isProd = import.meta.env.PROD;

    cookies.set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd, // ✅ Vercel(true) / Local(false)
      path: "/",
      maxAge: 60 * 60,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("login error:", err);
    return new Response(JSON.stringify({ ok: false, message: "No se pudo iniciar sesión.", code: "E_AUTH_ERR" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
