import type { APIRoute } from "astro";
import { CHALLENGE_COOKIE_NAME, HUMAN_COOKIE, verifyChallenge } from "../../lib/human";
import { verifySession, SESSION_COOKIE } from "../../lib/session";

export const POST: APIRoute = async ({ request, cookies }) => {
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

    // ✅ Debe haber sesión para verificar
    const session = verifySession(authSecret, cookies.get(SESSION_COOKIE)?.value);
    if (!session.ok) {
      return new Response(JSON.stringify({ ok: false, message: "No autorizado.", code: "E_CAPTCHA_AUTH" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const form = await request.formData();
    const answer = String(form.get("answer") ?? "");

    const cookieValue = cookies.get(CHALLENGE_COOKIE_NAME)?.value;
    const result = verifyChallenge(humanSecret, cookieValue, answer);

    if (!result.ok) {
      return new Response(JSON.stringify({ ok: false, message: result.reason, code: "E_CAPTCHA_BAD" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    cookies.set(HUMAN_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd, // ✅
      path: "/",
      maxAge: 60 * 60,
    });

    cookies.delete(CHALLENGE_COOKIE_NAME, { path: "/" });

    return new Response(JSON.stringify({ ok: true, redirectTo: "/home" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("human-verify error:", err);
    return new Response(JSON.stringify({ ok: false, message: "No se pudo verificar.", code: "E_CAPTCHA_ERR" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
