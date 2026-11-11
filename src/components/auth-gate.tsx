import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/** Route protection without clerkMiddleware (hangs under Next 16 proxy). */
export async function AuthGate({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    const pathname = (await headers()).get("x-pathname");
    const safe =
      pathname &&
      pathname.startsWith("/") &&
      !pathname.startsWith("/sign-in") &&
      !pathname.startsWith("/sign-up")
        ? pathname
        : null;
    redirect(
      safe ? `/sign-in?redirect_url=${encodeURIComponent(safe)}` : "/sign-in",
    );
  }
  return children;
}
