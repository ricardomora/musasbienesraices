"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CITY_CENTROIDS, type LatLng } from "@/data/geo";
import { useMapTheme } from "@/hooks/use-map-theme";
import { getMapTileConfig } from "@/lib/map-tiles";
import { MapThemeToggle } from "./map-theme-toggle";

const pinIcon = L.divIcon({
  className: "musas-picker-pin",
  html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#39ff88;border:2px solid #0a0f0d;box-shadow:0 0 14px rgba(57,255,136,.65)"></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function ClickToPin({ onPick }: { onPick: (coords: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({
  cityId,
  hasPin,
  lat,
  lng,
  viewNonce,
}: {
  cityId: string;
  hasPin: boolean;
  lat?: number;
  lng?: number;
  viewNonce?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (hasPin && typeof lat === "number" && typeof lng === "number") {
      map.flyTo([lat, lng], 15, { duration: 0.75 });
      return;
    }
    const c = CITY_CENTROIDS[cityId] ?? CITY_CENTROIDS.caracas;
    map.setView([c.lat, c.lng], 12);
  }, [cityId, hasPin, lat, lng, viewNonce, map]);
  return null;
}

type LocationPickerMapProps = {
  cityId: string;
  value: LatLng | null;
  onChange: (coords: LatLng) => void;
  className?: string;
  /** Incrementa al elegir un sector para forzar flyTo. */
  viewNonce?: number;
};

export function LocationPickerMap({
  cityId,
  value,
  onChange,
  className,
  viewNonce = 0,
}: LocationPickerMapProps) {
  const { theme, setTheme } = useMapTheme();
  const tiles = getMapTileConfig(theme);
  const fallback = CITY_CENTROIDS[cityId] ?? CITY_CENTROIDS.caracas;
  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [fallback.lat, fallback.lng];
  const bg = theme === "dark" ? "#0a0f0d" : "#e8eef2";

  return (
    <div className="relative z-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          Capa del mapa
        </p>
        <MapThemeToggle theme={theme} onChange={setTheme} />
      </div>
      <div
        className={
          className ??
          "relative z-0 h-64 w-full overflow-hidden rounded-xl border border-white/15 sm:h-72"
        }
      >
        <MapContainer
          center={center}
          zoom={value ? 15 : 12}
          scrollWheelZoom
          className="h-full w-full"
          style={{ background: bg }}
        >
          <TileLayer
            key={theme + tiles.url}
            attribution={tiles.attribution}
            url={tiles.url}
            {...(tiles.subdomains
              ? { subdomains: tiles.subdomains }
              : {})}
          />
          <Recenter
            cityId={cityId}
            hasPin={!!value}
            lat={value?.lat}
            lng={value?.lng}
            viewNonce={viewNonce}
          />
          <ClickToPin onPick={onChange} />
          {value ? (
            <Marker
              key={`${value.lat.toFixed(5)}-${value.lng.toFixed(5)}-${viewNonce}`}
              position={[value.lat, value.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target as L.Marker;
                  const p = m.getLatLng();
                  onChange({ lat: p.lat, lng: p.lng });
                },
              }}
            />
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}
