"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  Heart,
  Home,
  MapPin,
  Ruler,
  SlidersHorizontal,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Filter = "todos" | "apartamentos" | "casas";

type Listing = {
  id: string;
  type: "apartamentos" | "casas";
  image: string;
  badge: string;
  location: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  alt: string;
};

const LISTINGS: Listing[] = [
  {
    id: "mirador",
    type: "casas",
    image: "/home-hero.jpg",
    badge: "Selección Musas",
    location: "El Poblado, Medellín",
    title: "Casa Mirador",
    price: "$ 2.450.000.000 COP",
    beds: 4,
    baths: 5,
    area: 420,
    alt: "Casa moderna al atardecer con piscina infinita",
  },
  {
    id: "altura",
    type: "apartamentos",
    image: "/penthouse-interior.png",
    badge: "Nuevo en Musas",
    location: "Rosales, Bogotá",
    title: "Penthouse Altura",
    price: "$ 1.890.000.000 COP",
    beds: 3,
    baths: 3,
    area: 280,
    alt: "Interior de penthouse con vista a la ciudad",
  },
  {
    id: "botanica",
    type: "casas",
    image: "/villa-day.png",
    badge: "Selección Musas",
    location: "Santa Fe, Ciudad de México",
    title: "Casa Botánica",
    price: "$ 3.100.000.000 COP",
    beds: 5,
    baths: 4,
    area: 510,
    alt: "Villa de día con jardín tropical y piscina",
  },
];

const FILTERS: { id: Filter; label: string; icon: "sliders" | "building" | "home" }[] =
  [
    { id: "todos", label: "Todos", icon: "sliders" },
    { id: "apartamentos", label: "Apartamentos", icon: "building" },
    { id: "casas", label: "Casas", icon: "home" },
  ];

export function Listings() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  const visible = useMemo(
    () =>
      filter === "todos"
        ? LISTINGS
        : LISTINGS.filter((item) => item.type === filter),
    [filter],
  );

  return (
    <section
      id="inmuebles"
      className="relative border-y border-white/5 bg-background py-20 sm:py-28"
      aria-label="Descubrimiento de inmuebles"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div>
              <h2 className="max-w-xl font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] tracking-tight text-white">
                Encuentra un lugar que se sienta tuyo.
              </h2>
              <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
                Una selección de espacios extraordinarios para tu próxima etapa.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <a
              href="#acceso"
              className="interactive-surface inline-flex items-center gap-2 text-sm text-white/75 hover:text-neon"
            >
              Ver todos los inmuebles
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filtrar por tipo"
            >
              {FILTERS.map((item) => {
                const active = filter === item.id;
                const Icon =
                  item.icon === "sliders"
                    ? SlidersHorizontal
                    : item.icon === "building"
                      ? Building2
                      : Home;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "interactive-surface inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
                      active
                        ? "border-neon bg-neon text-primary-foreground"
                        : "border-white/15 bg-white/[0.03] text-white/80 hover:border-white/30 hover:bg-white/[0.06]",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {visible.length} inmueble{visible.length === 1 ? "" : "s"} de
              ejemplo.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((listing, index) => (
            <motion.article
              key={listing.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#070b0a]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.alt}
                  fill
                  quality={95}
                  className="h-full w-full object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-md bg-ink/70 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
                  {listing.badge}
                </span>
                <button
                  type="button"
                  aria-label={
                    liked[listing.id] ? "Quitar de favoritos" : "Guardar favorito"
                  }
                  aria-pressed={Boolean(liked[listing.id])}
                  onClick={() =>
                    setLiked((prev) => ({
                      ...prev,
                      [listing.id]: !prev[listing.id],
                    }))
                  }
                  className="interactive-surface absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 text-white backdrop-blur-md hover:bg-ink/70"
                >
                  <Heart
                    className={cn(
                      "size-4",
                      liked[listing.id] ? "fill-neon text-neon" : "text-white",
                    )}
                    aria-hidden
                  />
                </button>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 text-neon/80" aria-hidden />
                  {listing.location}
                </p>
                <h3 className="font-display text-xl tracking-tight text-white">
                  {listing.title}
                </h3>
                <p className="text-lg font-medium tracking-tight text-white">
                  {listing.price}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="size-3.5" aria-hidden />
                    {listing.beds} hab.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Bath className="size-3.5" aria-hidden />
                    {listing.baths} baños
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Ruler className="size-3.5" aria-hidden />
                    {listing.area} m²
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3.5 text-sm sm:px-5">
                <span className="inline-flex items-center gap-1.5 text-white/80">
                  <Check className="size-3.5 text-neon" aria-hidden />
                  Ficha completa
                </span>
                <a
                  href="#acceso"
                  className="interactive-surface inline-flex items-center gap-1.5 text-white hover:text-neon"
                >
                  Ver inmueble
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
