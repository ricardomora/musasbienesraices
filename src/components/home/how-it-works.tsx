import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";

type HowItWorksProps = {
  onPublish?: () => void;
  /** Convex live: CTAs de producto, no waitlist/demo. */
  productLive?: boolean;
};

export function HowItWorks({ onPublish, productLive = false }: HowItWorksProps) {
  return (
    <>
      <section
        id="porque-una-musa"
        className="scroll-mt-24 border-t border-border bg-background py-8 sm:py-10"
      >
        <div className="mx-auto flex w-full max-w-[96rem] flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-12 xl:px-16">
          <div>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              ¿Por qué elegir una Musa?
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
              Elegir, vender o comprar puede ser estresante. Una Musa te quita
              ese estrés: con experiencia es certera con lo que necesitas y
              eficaz en el proceso.
            </p>
          </div>
          <Link
            href="/preferencial?paquete=acompanamiento"
            className="interactive-surface inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground hover:border-neon/45 hover:text-neon"
          >
            Contratar Acompañamiento
            <ArrowUpRight className="ml-2 size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section
        id="publicar"
        className="scroll-mt-24 border-t border-border bg-background py-8 sm:py-10"
      >
        <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-8 px-5 sm:gap-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                ¿Tienes un inmueble para vender?
              </h2>
              <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
                {productLive
                  ? "Publica con datos, precio en USD y fotos. Si quieres respaldo, una Musa te acompaña."
                  : "Con keys Musas activas publicas desde la app. Mientras tanto, deja tus datos en la landing."}
              </p>
            </div>
            <button
              type="button"
              onClick={onPublish}
              className="interactive-surface inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground hover:border-neon/45 hover:text-neon"
            >
              {productLive ? "Publicar inmueble" : "Pedir acceso para publicar"}
            </button>
          </div>

          <div
            id="agentes"
            className="flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:pt-10"
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                Haz crecer tu negocio inmobiliario
              </h2>
              <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
                Publica tus propiedades gratis, gestiona tus consultas y conecta
                con compradores e inquilinos.
              </p>
            </div>
            <Link
              href="/suscripciones"
              className="interactive-surface inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground hover:border-neon/45 hover:text-neon"
            >
              Registrarme como agente
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-6 px-5 text-sm text-muted-foreground sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 text-foreground">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-neon/40 text-neon">
                <Home className="size-3.5" aria-hidden />
              </span>
              <span className="font-semibold">
                musas<span className="text-neon">.</span>
              </span>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              <a href="#inmuebles" className="hover:text-neon">
                Explorar
              </a>
              <Link href="/mapa" className="hover:text-neon">
                Mapa
              </Link>
              <a href="#porque-una-musa" className="hover:text-neon">
                Una Musa
              </a>
              <Link href="/preferencial" className="hover:text-neon">
                Preferencial
              </Link>
              <Link href="/suscripciones" className="hover:text-neon">
                Realtors
              </Link>
              <Link href="/ayuda" className="hover:text-neon">
                Ayuda
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p>Venezuela · precios en USD</p>
            <p>© 2026 Musas</p>
          </div>
        </div>
      </footer>
    </>
  );
}
