import { defineMiddleware } from "astro/middleware";
import { HUMAN_COOKIE } from "./lib/human";

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (["/home", "/perfil", "/configuracion", "/formulario"].some((p) => ctx.url.pathname.startsWith(p))) {
    const ok = ctx.cookies.get(HUMAN_COOKIE)?.value === "1";
    if (!ok) return ctx.redirect("/", 302);
  }
  return next();
});
