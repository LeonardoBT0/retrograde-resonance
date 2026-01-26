import type { APIRoute } from "astro";
import { SESSION_COOKIE } from "../../../lib/session";
import { HUMAN_COOKIE } from "../../../lib/human";

export const POST: APIRoute = async ({ cookies }) => {
  const isProd = import.meta.env.PROD;

  cookies.delete(SESSION_COOKIE, {
    path: "/",
    secure: isProd,
  });

  cookies.delete(HUMAN_COOKIE, {
    path: "/",
    secure: isProd,
  });

  return new Response(JSON.stringify({ ok: true, redirectTo: "/" }), {
    headers: { "Content-Type": "application/json" },
  });
};
