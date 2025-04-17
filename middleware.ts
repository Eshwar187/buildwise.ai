import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/admin/sign-in",
  "/admin/register",
  "/admin/approve",
  "/admin/approval-confirmation",
  "/api/webhook/clerk",
  "/api/admin/register",
  "/api/admin/approve",
]);

// Export the middleware using clerkMiddleware with custom logic
export default clerkMiddleware((auth, req) => {
  // Just pass through all requests without any redirects
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
