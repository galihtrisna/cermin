import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/role-setup");

  // Kalau akses halaman terlindung tapi TIDAK ada token → ke /auth
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth?login", request.url));
  }

  // Selain itu, biarin aja lewat
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/role-setup"],
  // perhatikan: /auth TIDAK ikut matcher dulu, biar gak ikut-ikutan diintersep
};
