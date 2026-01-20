import { defineMiddleware } from "astro/middleware";
import { HUMAN_COOKIE } from "./lib/human";

export const onRequest = defineMiddleware(async (ctx, next) => {
  try {
    const protectedRoutes = ["/home", "/perfil", "/configuracion", "/formulario"];

    if (protectedRoutes.some((p) => ctx.url.pathname.startsWith(p))) {
      const isHuman = ctx.cookies.get(HUMAN_COOKIE)?.value === "1";

      if (!isHuman) {
        return ctx.redirect(
          "/error?msg=" +
            encodeURIComponent("Acceso no autorizado") +
            "&code=E_AUTH",
          302
        );
      }
    }

    return await next();
  } catch (err) {
    console.error("Middleware error:", err);

    return ctx.redirect(
      "/error?msg=" +
        encodeURIComponent("Error interno del sistema") +
        "&code=E_MW",
      302
    );
  }
});
