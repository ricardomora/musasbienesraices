"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import {
  ArrowUpRight,
  Home,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type HomeHeaderProps = {
  favoriteCount: number;
  onShowFavorites?: () => void;
  onPublish?: () => void;
};

export function HomeHeader({
  favoriteCount,
  onShowFavorites,
  onPublish,
}: HomeHeaderProps) {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="interactive-surface inline-flex items-center gap-2.5 text-white"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-neon/45 text-neon">
            <Home className="size-3.5" aria-hidden />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            musas<span className="text-neon">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] text-white/80 md:flex">
          <a href="#inmuebles" className="interactive-surface hover:text-white">
            Explorar
          </a>
          <Link href="/mapa" className="interactive-surface hover:text-white">
            Mapa
          </Link>
          <a
            href="#como-funciona"
            className="interactive-surface hover:text-white"
          >
            Cómo funciona
          </a>
          <Link
            href="/preferencial"
            className="interactive-surface hover:text-white"
          >
            Preferencial
          </Link>
          <Link href="/ayuda" className="interactive-surface hover:text-white">
            Ayuda
          </Link>
          <button
            type="button"
            onClick={onShowFavorites}
            className="interactive-surface hover:text-white"
          >
            Favoritos ({favoriteCount})
          </button>
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard/inmuebles"
                className="interactive-surface text-neon hover:text-white"
              >
                Mis inmuebles
              </Link>
              <Link
                href="/dashboard/mensajes"
                className="interactive-surface hover:text-white"
              >
                Mensajes
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle
            compact
            className="border-white/30 bg-ink/40 text-white hover:border-white/50"
          />
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="interactive-surface hidden rounded-full border border-white/25 px-3 py-2 text-sm text-white/85 sm:inline-flex"
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
                aria-label="Mi panel: inmuebles y mensajes"
              >
                <LayoutDashboard className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">Mi panel</span>
              </Link>
              <Link
                href="/dashboard/mensajes"
                className="interactive-surface inline-flex size-9 items-center justify-center rounded-full border border-white/25 text-white/85 hover:border-white/45 hover:text-white md:hidden"
                aria-label="Mensajes"
              >
                <MessageSquare className="size-3.5" aria-hidden />
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
                  <UserButton.Link
                    label="Mensajes"
                    href="/dashboard/mensajes"
                    labelIcon={<MessageSquare className="size-4" />}
                  />
                  <UserButton.Link
                    label="Preferencial"
                    href="/dashboard/preferencial"
                    labelIcon={<ArrowUpRight className="size-4" />}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </>
          ) : null}
          <button
            type="button"
            onClick={onPublish}
            className="interactive-surface inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-2.5 text-sm text-white hover:border-white/55 hover:bg-white/5 sm:px-4"
          >
            <span className="hidden sm:inline">Publicar mi inmueble</span>
            <span className="sm:hidden">Publicar</span>
            <ArrowUpRight className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
