import type { APIRoute } from "astro";
import { createChallenge } from "../../lib/human";
import { verifySession, SESSION_COOKIE } from "../../lib/session";

export const GET: APIRoute = async ({ cookies }) => {
  const isProd = import.meta.env.PROD;

  try {
    const humanSecret = import.meta.env.HUMAN_SECRET;
    const authSecret = import.meta.env.AUTH_SECRET;

    if (!humanSecret || !authSecret) {
      return new Response(JSON.stringify({ ok: false, message: "Servicio no disponible.", code: "E_CAPTCHA_CFG" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Debe haber sesión para pedir reto
    const session = verifySession(authSecret, cookies.get(SESSION_COOKIE)?.value);
    if (!session.ok) {
      return new Response(JSON.stringify({ ok: false, message: "No autorizado.", code: "E_CAPTCHA_AUTH" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ch = createChallenge(humanSecret);

    cookies.set(ch.cookieName, ch.cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd, // ✅
      path: "/",
      maxAge: ch.maxAge,
    });

    return new Response(JSON.stringify({ ok: true, question: ch.question }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("human-challenge error:", err);
    return new Response(JSON.stringify({ ok: false, message: "No se pudo cargar el reto.", code: "E_CAPTCHA_LOAD" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
