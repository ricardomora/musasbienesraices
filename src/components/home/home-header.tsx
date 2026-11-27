"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Home, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type HomeHeaderProps = {
  favoriteCount: number;
  onShowFavorites?: () => void;
  onPublish?: () => void;
};

export function HomeHeader({
  favoriteCount: _favoriteCount,
  onShowFavorites: _onShowFavorites,
  onPublish,
}: HomeHeaderProps) {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="interactive-surface on-media-shadow inline-flex items-center gap-2.5 text-white"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/80 bg-black/45 text-white shadow-[0_2px_14px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <Home className="size-3.5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">
              musas<span className="text-neon-on-media">.</span>
            </span>
          </Link>

          <nav className="on-media-shadow flex items-center gap-6 text-[14px] text-white/90 sm:gap-8">
            <a href="#inmuebles" className="interactive-surface hover:text-white">
              Explorar
            </a>
            <button
              type="button"
              onClick={onPublish}
              className="interactive-surface hover:text-white"
            >
              Publicar un inmueble
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle
            compact
            className="border-white/30 bg-ink/40 text-white hover:border-white/50"
          />

          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="interactive-surface rounded-full border border-white/25 px-3 py-2 text-sm text-white/85 hover:border-white/45 hover:text-white"
              >
                Iniciar sesión
              </button>
            </SignInButton>
          ) : null}

          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard/inmuebles"
                className="interactive-surface inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-black/45 px-3 py-2 text-sm font-medium text-white shadow-[0_2px_14px_rgba(0,0,0,0.35)] backdrop-blur-sm hover:border-neon-on-media/70 hover:bg-black/55 hover:text-neon-on-media sm:px-4"
                aria-label="Mi panel"
              >
                <LayoutDashboard className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">Mi panel</span>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8",
                  },
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
  );
}
