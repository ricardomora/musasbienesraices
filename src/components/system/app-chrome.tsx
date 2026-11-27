"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: React.ReactNode;
  /** Absolute header over hero imagery */
  overlay?: boolean;
  className?: string;
};

/**
 * Chrome de marketing. Guest: Explorar · Mapa · Preferencial · Realtors · Ayuda · Entrar.
 * SignedIn: mismo menú público + Mi panel + avatar (sin duplicar Mis inmuebles / Mensajes).
 */
export function AppChrome({
  children,
  overlay = false,
  className,
}: AppChromeProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const signInForceRedirect =
    pathname && pathname !== "/" && !pathname.startsWith("/sign-")
      ? pathname
      : undefined;

  return (
    <div className={cn("flex min-h-full flex-1 flex-col", className)}>
      <header
        className={cn(
          "z-30 border-b border-border bg-background/90 backdrop-blur-md",
          overlay &&
            "absolute inset-x-0 top-0 border-transparent bg-transparent backdrop-blur-0",
        )}
      >
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className={cn(
              "interactive-surface inline-flex items-center gap-2.5",
              overlay ? "text-white" : "text-foreground",
            )}
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full border border-neon/45 text-neon">
              <Home className="size-3.5" aria-hidden />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">
              musas<span className="text-neon">.</span>
            </span>
          </Link>

          <nav
            className={cn(
              "hidden items-center gap-6 text-[14px] md:flex",
              overlay ? "text-white/80" : "text-muted-foreground",
            )}
          >
            <Link href="/#inmuebles" className="hover:text-foreground">
              Explorar
            </Link>
            <Link href="/mapa" className="hover:text-foreground">
              Mapa
            </Link>
            <Link href="/preferencial" className="hover:text-foreground">
              Preferencial
            </Link>
            <Link href="/suscripciones" className="hover:text-foreground">
              Realtors
            </Link>
            <Link href="/ayuda" className="hover:text-foreground">
              Ayuda
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />
            {isLoaded && !isSignedIn ? (
              <SignInButton
                mode="modal"
                forceRedirectUrl={signInForceRedirect}
                fallbackRedirectUrl={signInForceRedirect ?? "/"}
              >
                <button
                  type="button"
                  className="interactive-surface hidden rounded-full border border-border px-3 py-2 text-sm text-foreground sm:inline-flex"
                >
                  Entrar
                </button>
              </SignInButton>
            ) : null}
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  href="/dashboard/inmuebles"
                  className="interactive-surface inline-flex items-center gap-1.5 rounded-full border border-neon/45 bg-neon/10 px-3 py-2 text-sm font-medium text-neon hover:bg-neon/20 sm:px-4"
                  aria-label="Mi panel"
                >
                  <LayoutDashboard className="size-3.5" aria-hidden />
                  <span className="hidden sm:inline">Mi panel</span>
                </Link>
                <UserButton
                  appearance={{
                    elements: { avatarBox: "size-8" },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Mis inmuebles"
                      href="/dashboard/inmuebles"
                      labelIcon={<LayoutDashboard className="size-4" />}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </>
            ) : null}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
