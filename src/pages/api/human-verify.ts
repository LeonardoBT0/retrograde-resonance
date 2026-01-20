import type { APIRoute } from "astro";
import { CHALLENGE_COOKIE_NAME, HUMAN_COOKIE, verifyChallenge } from "../../lib/human";

export const POST: APIRoute = async ({ request, cookies }) => {
  const secret = import.meta.env.HUMAN_SECRET;
  if (!secret) return new Response("Missing HUMAN_SECRET", { status: 500 });

  const form = await request.formData();
  const answer = String(form.get("answer") ?? "");

  const cookieValue = cookies.get(CHALLENGE_COOKIE_NAME)?.value;
  const result = verifyChallenge(secret, cookieValue, answer);

  if (!result.ok) {
    return new Response(JSON.stringify({ ok: false, message: result.reason }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set(HUMAN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // local
    path: "/",
    maxAge: 60 * 60,
  });

  cookies.delete(CHALLENGE_COOKIE_NAME, { path: "/" });

  return new Response(JSON.stringify({ ok: true, redirectTo: "/home" }), {
    headers: { "Content-Type": "application/json" },
  });
};
