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
import {
  budgetsForOperation,
  QUICK_SEARCH_CHIPS,
  type OperationType,
  type PropertyType,
} from "@/data/listings";
import { cn } from "@/lib/utils";

export type HeroSearchValues = {
  mode: "comprar" | "alquilar" | "favoritos";
  cityId: CityId | "all";
  type: PropertyType | "all";
  budgetId: string;
  q: string;
  sector: string;
  verifiedOnly: boolean;
};

type HeroSearchProps = {
  values: HeroSearchValues;
  favoriteCount: number;
  onChange: (next: Partial<HeroSearchValues>) => void;
  onSearch: () => void;
  /** Misma búsqueda pero resultados en mapa con pins. */
  onSearchMap?: () => void;
  onChipApply?: (chipId: string) => void;
};

const TRUST = [
  "Venta y alquiler en USD",
  "Precios claros en ficha",
  "Mapa nacional",
];

const VALUE_PROPS = [
  {
    icon: Shield,
    title: "La información, primero",
    body: "Cada detalle de venta para decidir con confianza.",
  },
  {
    icon: FileText,
    title: "Todo en un solo lugar",
    body: "Precio USD, espacios y características.",
  },
  {
    icon: Fingerprint,
    title: "A tu ritmo, a tu manera",
    body: "Sin presión. Tú tienes el control.",
  },
  {
    icon: Sparkles,
    title: "Menos pasos. Más hogar.",
    body: "Explora, pregunta y avanza con claridad.",
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
  onSearchMap,
  onChipApply,
}: HeroSearchProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const operation: OperationType =
    values.mode === "alquilar" ? "alquiler" : "venta";
  const budgetOptions = budgetsForOperation(operation);
  const chips = QUICK_SEARCH_CHIPS.filter(
    (chip) => !chip.operationType || chip.operationType === operation,
  );
  const activeChip = chips.find((chip) => {
    if (chip.verifiedOnly) return values.verifiedOnly;
    if (chip.sector)
      return values.sector.toLowerCase() === chip.sector.toLowerCase();
    if (chip.budgetId && chip.budgetId !== "any")
      return (
        values.budgetId === chip.budgetId &&
        !values.sector &&
        !values.verifiedOnly
      );
    if (chip.type && chip.type !== "all")
      return (
        values.type === chip.type &&
        !values.sector &&
        !values.verifiedOnly &&
        values.budgetId === "any"
      );
    if (chip.cityId && chip.cityId !== "all")
      return (
        values.cityId === chip.cityId &&
        !values.sector &&
        !values.verifiedOnly &&
        values.budgetId === "any" &&
        values.type === "all"
      );
    return false;
  })?.id;

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
              quality={100}
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
              className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-none tracking-tight text-white"
              {...fadeUp(reduce, 0.08)}
            >
              Musas
              <span className="text-neon">.</span>
            </motion.p>

            <motion.p
              className="mt-3 inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase sm:text-xs"
              {...fadeUp(reduce, 0.16)}
            >
              <span className="size-1.5 rounded-full bg-neon" aria-hidden />
              Venezuela · venta y alquiler en USD
            </motion.p>

            <h1 className="mt-5 text-[clamp(2.45rem,6.5vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-white">
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
              Compra o alquila en USD. Filtra por ciudad, mapa nacional y
              pregunta con claridad.
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
            <div className="mb-3 flex flex-wrap gap-6 text-[15px]">
              <button
                type="button"
                onClick={() =>
                  onChange({ mode: "comprar", budgetId: "any" })
                }
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
                onClick={() =>
                  onChange({ mode: "alquilar", budgetId: "any" })
                }
                className={cn(
                  "interactive-surface border-b-2 pb-2.5",
                  values.mode === "alquilar"
                    ? "border-neon text-white"
                    : "border-transparent text-white/55 hover:text-white",
                )}
              >
                Alquilar
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

            <div className="rounded-2xl border border-white/12 bg-black/40 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-2.5">
              <label className="mb-2 flex min-h-[3.25rem] cursor-text items-center gap-3 border-b border-white/10 px-4 py-2">
                <Search
                  className="size-4 shrink-0 text-neon/85"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.16em] text-white/45 uppercase">
                    Buscar por zona o título
                  </span>
                  <input
                    value={values.q}
                    onChange={(e) => onChange({ q: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSearch();
                    }}
                    placeholder="Ej. Altamira, terraza, 3 habitaciones…"
                    className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                  />
                </span>
              </label>

              <div className="lg:grid lg:grid-cols-[1.15fr_1.15fr_1.15fr_auto] lg:items-stretch lg:gap-0">
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
                          sector: "",
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
                      <option
                        value="apartamentos"
                        className="bg-ink text-white"
                      >
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
                      {operation === "alquiler"
                        ? "Renta USD / mes"
                        : "Presupuesto USD"}
                    </span>
                    <select
                      value={values.budgetId}
                      onChange={(e) =>
                        onChange({ budgetId: e.target.value })
                      }
                      className="w-full appearance-none bg-transparent text-[15px] text-white outline-none"
                    >
                      {budgetOptions.map((opt) => (
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

                <div className="flex flex-col gap-1.5 p-1.5 sm:p-2">
                  <button
                    type="button"
                    onClick={onSearch}
                    className="interactive-surface inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 text-[15px] font-semibold text-primary-foreground hover:bg-white lg:min-w-[12rem]"
                  >
                    <Search className="size-4" aria-hidden />
                    Buscar
                  </button>
                  <button
                    type="button"
                    onClick={onSearchMap}
                    className="interactive-surface inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 text-sm text-white hover:border-neon/50 hover:text-neon"
                  >
                    <MapPin className="size-3.5" aria-hidden />
                    Ver en mapa
                  </button>
                </div>
              </div>
            </div>

            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-label="Búsquedas rápidas"
            >
              {chips.map((chip) => {
                const active = activeChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => onChipApply?.(chip.id)}
                    className={cn(
                      "interactive-surface rounded-full border px-3 py-1.5 text-xs sm:text-[13px]",
                      active
                        ? "border-neon bg-neon/15 text-neon"
                        : "border-white/15 bg-white/[0.04] text-white/75 hover:border-white/30 hover:text-white",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
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

      <div className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-[96rem] gap-10 px-5 py-14 sm:grid-cols-2 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-4 lg:gap-14 lg:px-12 xl:px-16">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="space-y-4">
              <prop.icon
                className="size-6 text-neon"
                strokeWidth={1.6}
                aria-hidden
              />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {prop.title}
              </h2>
              <p className="max-w-[16rem] text-[15px] leading-relaxed text-muted-foreground">
                {prop.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
