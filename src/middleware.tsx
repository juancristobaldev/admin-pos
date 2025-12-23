import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Archivos estáticos (css, js, imágenes, etc.)
 */
const PUBLIC_FILE_PATH = /\.(.*)$/;

/**
 * Rutas públicas SOLO para usuarios NO autenticados
 * (si hay token → redirige)
 */
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
];

/**
 * Rutas SIEMPRE públicas
 * (nunca redirigen, exista token o no)
 */
const alwaysPublicRoutes = [
  "/landingpage",
  '/purchase',
  '/purchase/callback'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * 1. Omitir rutas internas de Next y archivos estáticos
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE_PATH.test(pathname)
  ) {
    return NextResponse.next();
  }

  /**
   * 2. Permitir rutas siempre públicas
   */
  if (alwaysPublicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  /**
   * 3. Obtener token (JWT)
   */
  const token = request.cookies.get("token")?.value;

  /**
   * 4. Acceso a rutas públicas (login, register, etc.)
   *    - Si hay token → redirigir a /local
   */
  if (publicRoutes.includes(pathname)) {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/local";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  /**
   * 5. Rutas privadas
   *    - Si NO hay token → redirigir a /login
   */
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/landingpage";
    return NextResponse.redirect(url);
  }

  /**
   * 6. (Opcional) Validación de roles
   * Ejemplo:
   *
   * const userRole = decodeJWT(token).role;
   * if (adminRoutes.includes(pathname) && userRole !== "ADMIN") {
   *   return NextResponse.redirect(new URL("/local", request.url));
   * }
   */

  /**
   * 7. Acceso permitido
   */
  return NextResponse.next();
}

/**
 * Configuración del matcher
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
