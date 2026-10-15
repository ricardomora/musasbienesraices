import Link from "next/link";
import { Home } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Descubre lo que va contigo",
    body: "Filtra por ubicación, tipo de inmueble y presupuesto. Guarda los espacios que te hacen sentir en casa.",
  },
  {
    n: "02",
    title: "Conoce cada detalle",
    body: "Consulta áreas, distribución, precio y administración. La información importante, sin tener que perseguirla.",
  },
  {
    n: "03",
    title: "Da el siguiente paso",
    body: "Elige tu espacio con calma. Revisa la ficha y prepara tus preguntas antes de visitar.",
  },
];

export function HowItWorks() {
  return (
    <>
      <section
        id="como-funciona"
        className="scroll-mt-24 border-t border-white/5 bg-background py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-neon uppercase">
                <span className="h-px w-8 bg-neon" aria-hidden />
                El camino a tu nuevo hogar
              </p>
              <h2 className="mt-4 max-w-xl text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-semibold tracking-tight text-white">
                Una gran decisión. Un proceso más simple.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground lg:text-right">
              Menos incertidumbre. Más posibilidades.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <article key={step.n} className="space-y-3">
                <p className="text-sm font-medium text-neon tabular-nums">
                  {step.n}
                </p>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="publicar"
        className="scroll-mt-24 border-t border-white/5 bg-background py-14"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              ¿Tienes un inmueble para publicar?
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Pronto podrás listar con claridad en Musas. Mientras tanto, deja
              tus datos en la landing de acceso anticipado.
            </p>
          </div>
          <Link
            href="/landing#acceso"
            className="interactive-surface inline-flex h-11 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
          >
            Pedir acceso para publicar
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="inline-flex items-center gap-2 text-white">
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-neon/40 text-neon">
              <Home className="size-3.5" aria-hidden />
            </span>
            <span className="font-semibold">
              musas<span className="text-neon">.</span>
            </span>
          </div>
          <p>Un lugar para vivir. Una nueva forma de encontrarlo.</p>
          <p>© 2026 Musas · Colección de demostración</p>
        </div>
      </footer>
    </>
  );
}
