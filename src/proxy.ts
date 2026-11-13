import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 `proxy` (ex-middleware).
 * Do NOT use clerkMiddleware here — it hangs under this Next 16 stack.
 * UploadThing auth uses createClerkClient().authenticateRequest(req) instead.
 * Pages use client AuthGate (useAuth).
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
