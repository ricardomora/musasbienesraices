"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Client-side route protection.
 * Avoids server `auth()` which requires clerkMiddleware (hangs under Next 16 proxy).
 *
 * Preview vs Production: Vercel Preview often lacks Clerk env while Production has it.
 * Never call useAuth without a publishable key, and never during SSR/prerender.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const hasClerk = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
  );

  if (!hasClerk) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Auth no configurada en este entorno (falta{" "}
        <code className="text-neon">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>
        ).
      </p>
    );
  }

  if (!isClient) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Comprobando sesión…
      </p>
    );
  }

  return <AuthGateClient>{children}</AuthGateClient>;
}

function AuthGateClient({ children }: { children: ReactNode }) {
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
