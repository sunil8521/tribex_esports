import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Determine login status:
  // 1. Valid access token → definitely logged in
  // 2. Expired/missing access token + has refresh token → STILL logged in
  //    (backend requireAuth will silently refresh on next API call)
  // 3. No access token + no refresh token → not logged in
  const secret = process.env.JWT_ACCESS_SECRET;

  let isLoggedIn = false;

  if (accessToken) {
    if (secret) {
      try {
        await jwtVerify(accessToken, new TextEncoder().encode(secret));
        isLoggedIn = true;
      } catch {
        // Access token expired/invalid — but if refresh token exists,
        // the backend will silently issue a new access token
        isLoggedIn = Boolean(refreshToken);
      }
    } else {
      isLoggedIn = true;
    }
  } else if (refreshToken) {
    // No access token (expired & removed from cookie), but refresh token
    // still exists → user is still logged in, backend will handle refresh
    isLoggedIn = true;
  }

  const isPublicOnly =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  const isProtected =
    pathname.startsWith("/my-matches") ||
    pathname.startsWith("/my-tournaments") ||
    pathname.startsWith("/profile");

  // Already logged in → keep them out of auth pages
  if (isPublicOnly && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("returnTo");
    return NextResponse.redirect(url);
  }

  // Not logged in → gate protected pages
  if (isProtected && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
    "/my-matches/:path*",
    "/my-tournaments/:path*",
    "/profile/:path*",
  ],
};
