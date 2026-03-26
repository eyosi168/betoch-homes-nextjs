// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Better Auth stores a session token cookie. 
  // The exact name might vary slightly based on your config, but this is the default:
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__Secure-better-auth.session_token");

  // If there is no cookie, they are definitely not logged in.
  if (!sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // Send them to your login page
    
    // Optional: Remember where they were trying to go so you can redirect them back after login
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    
    return NextResponse.redirect(url);
  }

  // If the cookie exists, let them through to the page
  return NextResponse.next();
}

// THIS IS THE CRITICAL PART: 
// Here you define exactly which routes trigger this middleware check.
export const config = {
  matcher: [
    "/addPost/:path*",     // Protects /add and anything inside it
    "/profile/:path*", // Protects /profile and anything inside it
    "/dashboard/:path*",
    // Add any other routes you want to lock down here
  ],
};