"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home,
  MapPin,
  Search,
  Wallet,
} from "lucide-react";
import { CITIES, type CityId } from "@/data/cities";
import {
  budgetsForOperation,
  type OperationType,
  type PropertyType,
} from "@/data/listings";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_PLURAL,
} from "@/lib/property-types";
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
};

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
  const operation: OperationType =
    values.mode === "alquilar" ? "alquiler" : "venta";
  const budgetOptions = budgetsForOperation(operation);

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
          {/* Day / dusk same crop — only opacity flips with theme (cambio de luz). */}
          <div className="absolute inset-0 w-full">
            <Image
              src="/home-hero-day.jpg"
              alt=""
              fill
              priority
              quality={90}
              sizes="100vw"
              className="h-full w-full object-cover object-[62%_38%] opacity-100 transition-opacity duration-700 ease-out dark:opacity-0"
              aria-hidden
            />
            <Image
              src="/home-hero.jpg"
              alt=""
              fill
              priority
              quality={100}
              sizes="100vw"
              className="h-full w-full object-cover object-[62%_38%] opacity-0 transition-opacity duration-700 ease-out dark:opacity-100"
              aria-hidden
            />
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-black/28 via-black/10 to-transparent transition-opacity duration-700 dark:from-black/42 dark:via-black/14"
            aria-hidden
          />
          {/* Soft bottom desvanecido → page bg */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 transition-[background] duration-700 sm:h-40"
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
              Compra, venta y alquileres
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
              Hazlo por ti mismo, o solicita a una Musa que te ayude en este
              proceso.
            </motion.p>
          </div>

          <motion.div
            className="mt-auto w-full max-w-none pt-8 sm:pt-10"
            {...fadeUp(reduce, 0.95)}
          >
            <div className="mb-3 flex flex-wrap gap-6 text-[15px]">
              {(
                [
                  ["comprar", "Comprar"],
                  ["alquilar", "Alquilar"],
                  ["favoritos", `Mis favoritos (${favoriteCount})`],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    mode === "favoritos"
                      ? onChange({ mode })
                      : onChange({
                          mode,
                          budgetId: "any",
                        })
                  }
                  className={cn(
                    "interactive-surface border-b-2 pb-2.5 text-white",
                    values.mode === mode
                      ? "border-neon"
                      : "border-transparent text-white/55 hover:text-white",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="hero-search-panel rounded-2xl border border-white/55 bg-white/82 p-2 shadow-[0_20px_60px_-20px_rgba(15,40,50,0.28)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-white/12 dark:bg-black/40 dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] sm:p-2.5">
              <label className="mb-2 flex min-h-[3.25rem] cursor-text items-center gap-3 border-b border-black/8 px-4 py-2 dark:border-white/10">
                <Search
                  className="size-4 shrink-0 text-neon"
                  aria-hidden
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.16em] text-foreground/45 uppercase dark:text-white/45">
                    Buscar por zona o título
                  </span>
                  <input
                    value={values.q}
                    onChange={(e) => onChange({ q: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSearch();
                    }}
                    placeholder="Ej. Altamira, terraza, 3 habitaciones…"
                    className="w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-foreground/35 dark:text-white dark:placeholder:text-white/35"
                  />
                </span>
              </label>

              <div className="lg:grid lg:grid-cols-[1.15fr_1.15fr_1.15fr_auto] lg:items-stretch lg:gap-0">
                <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-black/8 px-4 py-3 dark:border-white/10 lg:border-b-0 lg:border-r lg:border-black/8 dark:lg:border-white/10">
                  <MapPin
                    className="size-4 shrink-0 text-neon"
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[10px] tracking-[0.16em] text-foreground/45 uppercase dark:text-white/45">
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
                      className="w-full appearance-none bg-transparent text-[15px] text-foreground outline-none dark:text-white"
                    >
                      <option value="all" className="bg-card text-foreground">
                        Elige tu ciudad
                      </option>
                      {CITIES.map((city) => (
                        <option
                          key={city.id}
                          value={city.id}
                          className="bg-card text-foreground"
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>

                <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-black/8 px-4 py-3 dark:border-white/10 lg:border-b-0 lg:border-r lg:border-black/8 dark:lg:border-white/10">
                  <Home className="size-4 shrink-0 text-neon" aria-hidden />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[10px] tracking-[0.16em] text-foreground/45 uppercase dark:text-white/45">
                      Tipo de inmueble
                    </span>
                    <select
                      value={values.type}
                      onChange={(e) =>
                        onChange({
                          type: e.target.value as PropertyType | "all",
                        })
                      }
                      className="w-full appearance-none bg-transparent text-[15px] text-foreground outline-none dark:text-white"
                    >
                      <option value="all" className="bg-card text-foreground">
                        Todos los tipos
                      </option>
                      {PROPERTY_TYPES.map((t) => (
                        <option
                          key={t}
                          value={t}
                          className="bg-card text-foreground"
                        >
                          {PROPERTY_TYPE_PLURAL[t]}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>

                <label className="flex min-h-[4.25rem] cursor-pointer items-center gap-3 border-b border-black/8 px-4 py-3 dark:border-white/10 lg:border-b-0 lg:border-r lg:border-black/8 dark:lg:border-white/10">
                  <Wallet
                    className="size-4 shrink-0 text-neon"
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[10px] tracking-[0.16em] text-foreground/45 uppercase dark:text-white/45">
                      {operation === "alquiler"
                        ? "Renta USD / mes"
                        : "Presupuesto USD"}
                    </span>
                    <select
                      value={values.budgetId}
                      onChange={(e) =>
                        onChange({ budgetId: e.target.value })
                      }
                      className="w-full appearance-none bg-transparent text-[15px] text-foreground outline-none dark:text-white"
                    >
                      {budgetOptions.map((opt) => (
                        <option
                          key={opt.id}
                          value={opt.id}
                          className="bg-card text-foreground"
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
                    className="interactive-surface inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 text-[15px] font-semibold text-primary-foreground hover:brightness-110 dark:hover:bg-white lg:min-w-[12rem]"
                  >
                    <Search className="size-4" aria-hidden />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
