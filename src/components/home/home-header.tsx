"use client";

import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";

type HomeHeaderProps = {
  favoriteCount: number;
  onShowFavorites?: () => void;
};

export function HomeHeader({ favoriteCount, onShowFavorites }: HomeHeaderProps) {
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
            Explorar inmuebles
          </a>
          <a
            href="#como-funciona"
            className="interactive-surface hover:text-white"
          >
            Cómo funciona
          </a>
          <button
            type="button"
            onClick={onShowFavorites}
            className="interactive-surface hover:text-white"
          >
            Mis favoritos ({favoriteCount})
          </button>
        </nav>

        <a
          href="#publicar"
          className="interactive-surface inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2.5 text-sm text-white hover:border-white/55 hover:bg-white/5"
        >
          Publicar mi inmueble
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </header>
  );
}
