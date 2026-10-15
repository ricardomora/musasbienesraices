"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  FileText,
  Fingerprint,
  Home,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";
import { CITIES, type CityId } from "@/data/cities";
import { BUDGET_OPTIONS, type PropertyType } from "@/data/listings";
import { cn } from "@/lib/utils";

export type HeroSearchValues = {
  mode: "comprar" | "favoritos";
  cityId: CityId | "all";
  type: PropertyType | "all";
  budgetId: string;
};

type HeroSearchProps = {
  values: HeroSearchValues;
  favoriteCount: number;
  onChange: (next: Partial<HeroSearchValues>) => void;
  onSearch: () => void;
};

const TRUST = [
  "Información transparente",
  "Precios sin sorpresas",
  "Sin vueltas innecesarias",
];

const VALUE_PROPS = [
  {
    icon: Shield,
    title: "La información, primero",
    body: "Cada detalle para decidir con confianza.",
  },
  {
    icon: FileText,
    title: "Todo en un solo lugar",
    body: "Precios, espacios y características.",
  },
  {
    icon: Fingerprint,
    title: "A tu ritmo, a tu manera",
    body: "Sin presión. Tú tienes el control.",
  },
  {
    icon: Sparkles,
    title: "Menos pasos. Más hogar.",
    body: "Una experiencia simple de principio a fin.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function fadeUp(reduce: boolean | null, delay: number) {
  if (reduce) {
    return { initial: false as const, animate: { opacity: 1, y: 0 } };
  }
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease },
  };
}

export function HeroSearch({
  values,
  favoriteCount,
  onChange,
  onSearch,
}: HeroSearchProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="Inicio Musas"
    >
      <div
        className="relative flex flex-col justify-end pb-8 pt-28 sm:pb-10 sm:pt-28"
        style={{
          height: 840,
          minHeight: 780,
          maxHeight: 950,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 w-full">
            <Image
              src="/home-hero.jpg"
              alt=""
              fill
              priority
              quality={97}
              sizes="100vw"
              className="h-full w-full object-cover object-[62%_38%]"
              aria-hidden
            />
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-black/38 via-black/12 to-transparent"
            aria-hidden
          />
          {/* Soft bottom desvanecido */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-40"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--background) 40%, transparent) 55%, var(--background) 100%)",
            }}
            aria-hidden
          />
        </div>

        <motion.p
          className="pointer-events-none absolute bottom-24 right-6 z-10 hidden max-w-[12rem] text-right text-[11px] leading-relaxed text-white/50 xl:right-10 xl:block 2xl:right-14"
          {...fadeUp(reduce, 1.15)}
        >
          <MapPin className="mr-1 inline size-3 text-neon/70" aria-hidden />
          Los Palos Grandes, Caracas
          <br />
          Casa Ávila · Selección Musas
        </motion.p>

        {/* Wider shell on large screens — less narrow centered column */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[96rem] flex-col px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-4xl pt-2 xl:max-w-5xl sm:pt-4">
            <motion.p
              className="inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.22em] text-white uppercase sm:text-xs"
              {...fadeUp(reduce, 0.12)}
            >
              <span className="size-1.5 rounded-full bg-neon" aria-hidden />
              Una nueva forma de encontrar hogar
            </motion.p>

            <h1 className="mt-5 text-[clamp(2.85rem,7.5vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-white">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.95, delay: 0.28, ease }}
                >
                  Tu próximo lugar.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-neon"
                  initial={reduce ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.95, delay: 0.4, ease }}
                >
                  Sin complicaciones.
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-white/90 sm:text-xl sm:leading-relaxed xl:max-w-3xl"
              {...fadeUp(reduce, 0.62)}
            >
              Espacios que conectan contigo. Información que da confianza.
              <br className="hidden sm:block" />
              Todo lo que necesitas para dar el siguiente paso.
            </motion.p>

            <motion.div className="mt-8" {...fadeUp(reduce, 0.78)}>
              <a
                href="#inmuebles"
                className="interactive-surface inline-flex items-center gap-2.5 rounded-full bg-neon px-7 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_0_40px_-12px_color-mix(in_srgb,var(--neon)_70%,transparent)] hover:bg-white"
              >
                Encuentra tu hogar
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="mt-auto w-full max-w-none pt-8 sm:pt-10"
            {...fadeUp(reduce, 0.95)}
          >
            <div className="mb-3 flex gap-6 text-[15px]">
              <button
                type="button"
                onClick={() => onChange({ mode: "comprar" })}
                className={cn(
                  "interactive-surface border-b-2 pb-2.5",
                  values.mode === "comprar"
                    ? "border-neon text-white"
                    : "border-transparent text-white/55 hover:text-white",
                )}
              >
                Comprar
              </button>
              <button
                type="button"
                onClick={() => onChange({ mode: "favoritos" })}
                className={cn(
                  "interactive-surface border-b-2 pb-2.5",
                  values.mode === "favoritos"
                    ? "border-neon text-white"
                    : "border-transparent text-white/55 hover:text-white",
                )}
              >
                Mis favoritos ({favoriteCount})
              </button>
            </div>

            <div className="rounded-2xl border border-white/12 bg-black/40 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-2.5 lg:grid lg:grid-cols-[1.15fr_1.15fr_1.15fr_auto] lg:items-stretch lg:gap-0">
              <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-white/10 px-4 py-3 lg:border-b-0 lg:border-r">
                <MapPin
                  className="size-4 shrink-0 text-neon/85"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.16em] text-white/45 uppercase">
                    Ubicación
                  </span>
                  <select
                    value={values.cityId}
                    onChange={(e) =>
                      onChange({
                        cityId: e.target.value as CityId | "all",
                      })
                    }
                    className="w-full appearance-none bg-transparent text-[15px] text-white outline-none"
                  >
                    <option value="all" className="bg-ink text-white">
                      Elige tu ciudad
                    </option>
                    {CITIES.map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                        className="bg-ink text-white"
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-white/10 px-4 py-3 lg:border-b-0 lg:border-r">
                <Home className="size-4 shrink-0 text-neon/85" aria-hidden />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.16em] text-white/45 uppercase">
                    Tipo de inmueble
                  </span>
                  <select
                    value={values.type}
                    onChange={(e) =>
                      onChange({
                        type: e.target.value as PropertyType | "all",
                      })
                    }
                    className="w-full appearance-none bg-transparent text-[15px] text-white outline-none"
                  >
                    <option value="all" className="bg-ink text-white">
                      Todos los tipos
                    </option>
                    <option value="apartamentos" className="bg-ink text-white">
                      Apartamentos
                    </option>
                    <option value="casas" className="bg-ink text-white">
                      Casas
                    </option>
                  </select>
                </span>
              </label>

              <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-white/10 px-4 py-3 lg:border-b-0 lg:border-r">
                <Wallet
                  className="size-4 shrink-0 text-neon/85"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.16em] text-white/45 uppercase">
                    Presupuesto
                  </span>
                  <select
                    value={values.budgetId}
                    onChange={(e) => onChange({ budgetId: e.target.value })}
                    className="w-full appearance-none bg-transparent text-[15px] text-white outline-none"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.id}
                        className="bg-ink text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <div className="flex items-center p-1.5 sm:p-2">
                <button
                  type="button"
                  onClick={onSearch}
                  className="interactive-surface inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neon px-6 text-[15px] font-semibold text-primary-foreground hover:bg-white lg:h-full lg:min-w-[13rem]"
                >
                  <Search className="size-4" aria-hidden />
                  Buscar inmuebles
                </button>
              </div>
            </div>

            <motion.ul
              className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80"
              {...fadeUp(reduce, 1.08)}
            >
              {TRUST.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-neon" aria-hidden />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-background">
        <div className="mx-auto grid max-w-[96rem] gap-10 px-5 py-14 sm:grid-cols-2 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-4 lg:gap-14 lg:px-12 xl:px-16">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="space-y-4">
              <prop.icon
                className="size-6 text-neon"
                strokeWidth={1.6}
                aria-hidden
              />
              <h2 className="text-lg font-semibold tracking-tight text-white">
                {prop.title}
              </h2>
              <p className="max-w-[16rem] text-[15px] leading-relaxed text-white/55">
                {prop.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
