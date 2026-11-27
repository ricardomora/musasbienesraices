"use client";

import { esES } from "@clerk/localizations";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Toaster } from "sonner";
import { api } from "../../convex/_generated/api";
import { AccountKindGate } from "@/components/auth/account-kind-gate";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useTheme } from "@/components/theme/theme-provider";

function EnsureConvexUser({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    void (async () => {
      try {
        // Pull real email from Clerk API → Convex (JWT template may omit email).
        await fetch("/api/me/sync", { method: "POST", credentials: "include" });
        if (cancelled) return;
        await ensureCurrentUser();
      } catch (err) {
        console.error("Error ensuring Convex user:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureCurrentUser, isLoaded, isSignedIn]);

  return children;
}

function SetupBanner({ missing }: { missing: string[] }) {
  return (
    <div className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
      Musas aún no tiene keys de entorno ({missing.join(", ")}). Copia{" "}
      <code className="text-neon">.env.example</code> →{" "}
      <code className="text-neon">.env.local</code> con un proyecto Clerk /
      Convex / UploadThing <strong>nuevo</strong> (no reutilices Biosite).
    </div>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** ConvexReactClient uses Math.random — only construct after client hydration. */
function useConvexClient(convexUrl: string | undefined) {
  const isClient = useIsClient();
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (!isClient || !convexUrl) {
      setClient(null);
      return;
    }
    const next = new ConvexReactClient(convexUrl);
    setClient(next);
    return () => setClient(null);
  }, [isClient, convexUrl]);

  return client;
}

export function Providers({ children }: { children: ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  const missing = [
    !clerkKey ? "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" : null,
    !convexUrl ? "NEXT_PUBLIC_CONVEX_URL" : null,
  ].filter(Boolean) as string[];

  const convex = useConvexClient(convexUrl);
  const waitingForConvex = Boolean(convexUrl) && !convex;

  const isClient = useIsClient();

  // Without Clerk, many trees call useAuth (header, gates, etc.). Rendering them
  // during prerender crashes Vercel Preview when Preview env lacks the key
  // (Production usually has it — that is why only Preview fails).
  const canMountApp = Boolean(clerkKey) && isClient && !waitingForConvex;

  const shell = (
    <ThemeProvider>
      {missing.length > 0 ? <SetupBanner missing={missing} /> : null}
      {canMountApp ? (
        children
      ) : (
        <div className="flex flex-1 items-center justify-center px-5 py-24 text-sm text-muted-foreground">
          {missing.length > 0
            ? "Configura las variables de entorno de Musas para este deploy."
            : "Cargando Musas…"}
        </div>
      )}
      <ThemedToaster />
    </ThemeProvider>
  );

  if (!clerkKey) {
    return shell;
  }

  return (
    <ClerkProvider
      localization={esES}
      publishableKey={clerkKey}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
      signInFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/"
      }
      signUpFallbackRedirectUrl={
        process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/"
      }
    >
      {convex ? (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <EnsureConvexUser>
            <AccountKindGate>{shell}</AccountKindGate>
          </EnsureConvexUser>
        </ConvexProviderWithClerk>
      ) : (
        shell
      )}
    </ClerkProvider>
  );
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} richColors position="top-center" />;
}
