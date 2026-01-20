import type { APIRoute } from "astro";
import { createChallenge } from "../../lib/human";

export const GET: APIRoute = async ({ cookies }) => {
  const secret = import.meta.env.HUMAN_SECRET;
  if (!secret) return new Response("Missing HUMAN_SECRET", { status: 500 });

  const ch = createChallenge(secret);

  cookies.set(ch.cookieName, ch.cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // local
    path: "/",
    maxAge: ch.maxAge,
  });

  return new Response(JSON.stringify({ question: ch.question }), {
    headers: { "Content-Type": "application/json" },
  });
};
