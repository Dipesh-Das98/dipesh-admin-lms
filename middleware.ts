import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  PROTECTED_ROUTES,
  apiAuthPrefix,
} from "./routes";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  // @ts-expect-error - NextAuth types don't include auth on request object
  const isLoggedIn = !!req?.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    new RegExp(route).test(nextUrl.pathname)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Running in development mode");
    console.log("[Middleware] Is API Auth Route:", isApiAuthRoute);
    console.log("[Middleware] Is Protected Route:", isProtectedRoute);
    console.log("[Middleware] Is Auth Route:", isAuthRoute);
  }

    console.log("[Middleware] Request URL:", nextUrl.pathname);
    console.log("[Middleware] Is Logged In:", isLoggedIn);
  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing auth routes while logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect to login if accessing protected routes while not logged in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect to login if not logged in and trying to access root
  if (nextUrl.pathname === "/" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect to dashboard if logged in and trying to access root
  if (nextUrl.pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|_next/static|_next/image|favicon.ico|api/auth).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
