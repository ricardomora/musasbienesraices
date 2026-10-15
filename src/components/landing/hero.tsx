import Image from "next/image";
import { SiteHeader } from "./site-header";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Presentación Musas"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero-property.jpg"
          alt="Residencia moderna con fachada de piedra y vegetación, luz de atardecer"
          fill
          priority
          className="kenburns object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-pine-deep/55 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <SiteHeader />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:pb-24">
        <p className="reveal font-display text-5xl leading-none tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Musas
        </p>
        <h1 className="reveal reveal-delay-1 mt-5 max-w-2xl font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          Vende tu propiedad sin el abuso de siempre.
        </h1>
        <p className="reveal reveal-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Una app nueva que simplifica y revoluciona la venta inmobiliaria:
          claridad, control y trato justo para quien publica.
        </p>
        <div className="reveal reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#acceso"
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-pine-deep transition hover:bg-mist"
          >
            Pedir acceso anticipado
          </a>
          <a
            href="#diferencia"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/40 px-6 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cómo funciona Musas
          </a>
        </div>
      </div>
    </section>
  );
}
