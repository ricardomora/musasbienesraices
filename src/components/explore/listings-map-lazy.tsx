"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/data/listings";

const ListingsMap = dynamic(
  () =>
    import("./listings-map").then((m) => m.ListingsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-muted-foreground">
        Cargando mapa…
      </div>
    ),
  },
);

export function ListingsMapLazy({
  listings,
  className,
  national,
}: {
  listings: Listing[];
  className?: string;
  national?: boolean;
}) {
  return (
    <ListingsMap
      listings={listings}
      className={className}
      national={national}
    />
  );
}
