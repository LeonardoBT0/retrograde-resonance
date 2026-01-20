import * as crypto from "node:crypto";


export const HUMAN_COOKIE = "human_verified";
const CHALLENGE_COOKIE = "human_challenge";
const TTL_SECONDS = 2 * 60;

function hmac(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function createChallenge(secret: string) {
  const a = crypto.randomInt(2, 10);
  const b = crypto.randomInt(2, 10);
  const answer = String(a + b);
  const ts = Math.floor(Date.now() / 1000);

  const token = `${ts}:${hmac(secret, `${ts}:${answer}`)}`;
  return {
    question: `¿Cuánto es ${a} + ${b}?`,
    cookieValue: token,
    maxAge: TTL_SECONDS,
    cookieName: CHALLENGE_COOKIE,
  };
}

export function verifyChallenge(secret: string, cookieValue: string | undefined, userAnswer: string) {
  if (!cookieValue) return { ok: false, reason: "No hay reto activo." };

  const [tsStr, answerHash] = cookieValue.split(":");
  const ts = Number(tsStr);
  if (!ts || !answerHash) return { ok: false, reason: "Reto inválido." };

  const now = Math.floor(Date.now() / 1000);
  if (now - ts > TTL_SECONDS) return { ok: false, reason: "Reto expirado. Refresca." };

  const computed = hmac(secret, `${ts}:${userAnswer.trim()}`);
  const ok =
    computed.length === answerHash.length &&
    crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(answerHash));

  return ok ? { ok: true } : { ok: false, reason: "Respuesta incorrecta." };
}

export const CHALLENGE_COOKIE_NAME = CHALLENGE_COOKIE;
