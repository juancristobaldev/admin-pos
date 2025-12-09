import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Definir las rutas públicas (sin necesidad de token)
const PUBLIC_FILE_PATH = /\.(.*)$/; // Excluye archivos estáticos (CSS, JS, imágenes)

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/", // Home/Landing page (si aplica)
];

// Rutas a las que solo puede acceder el administrador (Opcional, basado en el rol de tu proyecto)
// const adminRoutes = ['/admin', '/admin/users', '/admin/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Omitir archivos estáticos y rutas especiales de Next.js
  if (
    pathname.includes("/_next") ||
    pathname.includes("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE_PATH.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Verificar el token
  // Usamos el nombre 'token' basado en donde lo guardamos en AuthLogin.tsx
  const token = request.cookies.get("token");

  // Nota: El backend emite un JWT que debe estar en el token

  // 3. Lógica de Redirección

  // A. Si el usuario intenta acceder a una ruta protegida (NO pública)
  if (!publicRoutes.includes(pathname)) {
    // Si no hay token, redirigir a Login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Si hay token, permitir el acceso a la ruta protegida
    return NextResponse.next();

    // Lógica para verificar rol (Si tuviéramos un JWT complejo o una API de validación de rol)
    // if (adminRoutes.includes(pathname) && userRole !== 'Administrador') {
    //    return NextResponse.redirect(new URL('/operational/tables', request.url));
    // }
  }

  // B. Si el usuario intenta acceder a /login o /register teniendo un token
  if (publicRoutes.includes(pathname) && token) {
    // Redirigir al área operativa (Plano de Mesas)
    const url = request.nextUrl.clone();
    url.pathname = "/local";
    return NextResponse.redirect(url);
  }

  // 4. Por defecto, permitir (ej. rutas públicas sin token)
  return NextResponse.next();
}

// 5. Configuración del Middleware (Opcional pero útil para performance)
export const config = {
  // Solo aplicar middleware a estas rutas
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
