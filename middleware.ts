import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/properties(.*)",
  "/settings(.*)",
  "/admin(.*)",           // admin panel — fine-grained check handled by checkAdmin()
  "/api/properties(.*)", // host-facing API routes (QR generation, etc.)
  "/api/orders(.*)", // host order actions (mark paid, etc.)
  "/api/stripe/connect", // host Stripe Connect OAuth (not callback — Stripe redirects here)
  "/api/billing(.*)", // Paddle customer portal redirect
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtected(req)) {
    await auth.protect();
  }

  const res = NextResponse.next();

  // Security headers on every response
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
