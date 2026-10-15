import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="#inicio"
          className="font-display text-lg tracking-tight text-white/95 drop-shadow-sm"
        >
          Musas
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/85">
          <a href="#problema" className="hidden hover:text-white sm:inline">
            El problema
          </a>
          <a href="#diferencia" className="hidden hover:text-white sm:inline">
            Musas
          </a>
          <a
            href="#acceso"
            className="rounded-md border border-white/35 bg-white/10 px-3 py-1.5 backdrop-blur-sm transition hover:bg-white/20"
          >
            Acceso
          </a>
        </nav>
      </div>
    </header>
  );
}
