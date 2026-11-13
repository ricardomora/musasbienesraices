"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/**
 * Client-side route protection.
 * Avoids server `auth()` which requires clerkMiddleware (hangs under Next 16 proxy).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;
    const safe =
      pathname &&
      pathname.startsWith("/") &&
      !pathname.startsWith("/sign-in") &&
      !pathname.startsWith("/sign-up")
        ? pathname
        : null;
    router.replace(
      safe ? `/sign-in?redirect_url=${encodeURIComponent(safe)}` : "/sign-in",
    );
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Comprobando sesión…
      </p>
    );
  }

  if (!isSignedIn) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Redirigiendo a iniciar sesión…
      </p>
    );
  }

  return children;
}
