import crypto from "node:crypto";

export const SESSION_COOKIE = "auth_session";

function hmac(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function createSession(secret: string, userId: number) {
  const ts = Math.floor(Date.now() / 1000);
  const payload = `${userId}.${ts}`;
  const sig = hmac(secret, payload);
  return `${payload}.${sig}`;
}

export function verifySession(secret: string, cookieValue?: string) {
  if (!cookieValue) return { ok: false as const };
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return { ok: false as const };

  const [userIdStr, tsStr, sig] = parts;
  const payload = `${userIdStr}.${tsStr}`;
  const expected = hmac(secret, payload);

  const safe =
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));

  if (!safe) return { ok: false as const };

  const userId = Number(userIdStr);
  if (!Number.isFinite(userId)) return { ok: false as const };

  return { ok: true as const, userId };
}
