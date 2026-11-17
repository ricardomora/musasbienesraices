"use client";

import dynamic from "next/dynamic";
import type { LatLng } from "@/data/geo";

const LocationPickerMap = dynamic(
  () =>
    import("./location-picker-map").then((m) => m.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-xl border border-white/15 bg-white/[0.02] text-sm text-muted-foreground sm:h-72">
        Cargando mapa…
      </div>
    ),
  },
);

export function LocationPickerLazy({
  cityId,
  value,
  onChange,
  className,
  viewNonce,
}: {
  cityId: string;
  value: LatLng | null;
  onChange: (coords: LatLng) => void;
  className?: string;
  viewNonce?: number;
}) {
  return (
    <LocationPickerMap
      cityId={cityId}
      value={value}
      onChange={onChange}
      className={className}
      viewNonce={viewNonce}
    />
  );
}
