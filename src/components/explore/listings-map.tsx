"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { resolveListingCoords, VE_MAP_CENTER, VE_MAP_ZOOM } from "@/data/geo";
import {
  formatListingPrice,
  listingOperation,
  type Listing,
} from "@/data/listings";
import { useMapTheme } from "@/hooks/use-map-theme";
import { getMapTileConfig } from "@/lib/map-tiles";
import { MapThemeToggle } from "./map-theme-toggle";

const pinIcon = L.divIcon({
  className: "musas-map-pin",
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#39ff88;border:2px solid #0a0f0d;box-shadow:0 0 12px rgba(57,255,136,.55)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({
  points,
}: {
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 13);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [map, points]);
  return null;
}

type ListingsMapProps = {
  listings: Listing[];
  className?: string;
  /** Vista país (Venezuela) cuando no hay ciudad filtrada. */
  national?: boolean;
};

export function ListingsMap({
  listings,
  className,
  national = false,
}: ListingsMapProps) {
  const { theme, setTheme } = useMapTheme();
  const tiles = getMapTileConfig(theme);
  const bg = theme === "dark" ? "#0a0f0d" : "#e8eef2";

  const pins = useMemo(
    () =>
      listings.map((listing) => {
        const coords = resolveListingCoords({
          cityId: listing.cityId,
          neighborhood: listing.neighborhood,
          lat: listing.lat,
          lng: listing.lng,
        });
        return { listing, ...coords };
      }),
    [listings],
  );

  const center = national
    ? ([VE_MAP_CENTER.lat, VE_MAP_CENTER.lng] as [number, number])
    : pins[0]
      ? ([pins[0].lat, pins[0].lng] as [number, number])
      : ([VE_MAP_CENTER.lat, VE_MAP_CENTER.lng] as [number, number]);

  return (
    <div className="relative space-y-2">
      <div className="flex justify-end">
        <MapThemeToggle theme={theme} onChange={setTheme} />
      </div>
      <div
        className={
          className ??
          "h-[min(70vh,560px)] w-full overflow-hidden rounded-2xl border border-white/10"
        }
      >
        <MapContainer
          center={center}
          zoom={national ? VE_MAP_ZOOM : 11}
          scrollWheelZoom={false}
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
          {pins.length > 0 ? <FitBounds points={pins} /> : null}
          {pins.map(({ listing, lat, lng }) => (
            <Marker key={listing.id} position={[lat, lng]} icon={pinIcon}>
              <Popup>
                <div className="min-w-[10rem] space-y-1 text-sm">
                  <p className="font-semibold text-ink">{listing.title}</p>
                  <p className="text-ink/70">
                    {listing.neighborhood} · {formatListingPrice(listing)} ·{" "}
                    {listingOperation(listing) === "alquiler"
                      ? "Alquiler"
                      : "Venta"}
                  </p>
                  <Link
                    href={`/inmuebles/${listing.slug}`}
                    className="inline-block text-[#0d8f4a] underline"
                  >
                    Ver ficha
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
