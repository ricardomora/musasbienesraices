/** Centroides aproximados — mapa nacional Musas. */

export type LatLng = { lat: number; lng: number };

export const CITY_CENTROIDS: Record<string, LatLng> = {
  caracas: { lat: 10.4806, lng: -66.9036 },
  valencia: { lat: 10.1621, lng: -68.0077 },
  maracaibo: { lat: 10.6666, lng: -71.6125 },
  barquisimeto: { lat: 10.0678, lng: -69.3474 },
  maracay: { lat: 10.2353, lng: -67.5911 },
  merida: { lat: 8.5897, lng: -71.1561 },
  "puerto-ordaz": { lat: 8.303, lng: -62.733 },
  lecheria: { lat: 10.186, lng: -64.69 },
  barcelona: { lat: 10.1333, lng: -64.7 },
  maturin: { lat: 9.7457, lng: -63.1832 },
  "san-cristobal": { lat: 7.7669, lng: -72.225 },
  "ciudad-bolivar": { lat: 8.1292, lng: -63.5409 },
  porlamar: { lat: 10.9577, lng: -63.8497 },
  "punto-fijo": { lat: 11.6956, lng: -70.199 },
  cabimas: { lat: 10.3883, lng: -71.442 },
};

/** Bounds aproximados Venezuela para vista nacional. */
export const VE_MAP_CENTER: LatLng = { lat: 8.5, lng: -66.5 };
export const VE_MAP_ZOOM = 6;

export type SectorSuggestion = {
  id: string;
  label: string;
  cityId: string;
  lat: number;
  lng: number;
  source: "local" | "geocode";
};

/** Sectores Caracas frecuentes — filtro chips + pins mapa. */
export const CARACAS_SECTORS: {
  id: string;
  label: string;
  lat: number;
  lng: number;
}[] = [
  { id: "altamira", label: "Altamira", lat: 10.496, lng: -66.849 },
  {
    id: "los-palos-grandes",
    label: "Los Palos Grandes",
    lat: 10.498,
    lng: -66.845,
  },
  { id: "la-castellana", label: "La Castellana", lat: 10.501, lng: -66.854 },
  { id: "chacao", label: "Chacao", lat: 10.493, lng: -66.855 },
  { id: "el-hatillo", label: "El Hatillo", lat: 10.424, lng: -66.824 },
  { id: "las-mercedes", label: "Las Mercedes", lat: 10.482, lng: -66.86 },
  { id: "la-trinidad", label: "La Trinidad", lat: 10.437, lng: -66.872 },
  { id: "el-cafetal", label: "El Cafetal", lat: 10.464, lng: -66.836 },
  { id: "sebastian", label: "Sebucán", lat: 10.505, lng: -66.837 },
  { id: "prados-del-este", label: "Prados del Este", lat: 10.45, lng: -66.89 },
  { id: "el-paraiso", label: "El Paraíso", lat: 10.488, lng: -66.916 },
  { id: "la-florida", label: "La Florida", lat: 10.5, lng: -66.879 },
  { id: "san-bernardino", label: "San Bernardino", lat: 10.51, lng: -66.9 },
  { id: "los-chorros", label: "Los Chorros", lat: 10.508, lng: -66.835 },
  { id: "la-tahona", label: "La Tahona", lat: 10.43, lng: -66.84 },
  { id: "macaracuay", label: "Macaracuay", lat: 10.475, lng: -66.82 },
  { id: "el-marques", label: "El Marqués", lat: 10.47, lng: -66.81 },
  { id: "sabana-grande", label: "Sabana Grande", lat: 10.492, lng: -66.875 },
  { id: "plaza-venezuela", label: "Plaza Venezuela", lat: 10.496, lng: -66.887 },
  { id: "bello-monte", label: "Bello Monte", lat: 10.49, lng: -66.87 },
  { id: "la-boyera", label: "La Boyera", lat: 10.42, lng: -66.85 },
  { id: "el-hatillo-pueblo", label: "Pueblo El Hatillo", lat: 10.423, lng: -66.823 },
  { id: "baruta", label: "Baruta", lat: 10.434, lng: -66.876 },
  { id: "la-union", label: "La Unión", lat: 10.43, lng: -66.82 },
];

const VALENCIA_SECTORS = [
  { id: "naguanagua", label: "Naguanagua", lat: 10.25, lng: -67.99 },
  { id: "san-diego", label: "San Diego", lat: 10.23, lng: -67.95 },
  { id: "el-vinedo", label: "El Viñedo", lat: 10.18, lng: -67.99 },
  { id: "la-viña", label: "La Viña", lat: 10.17, lng: -68.0 },
  { id: "prebo", label: "Prebo", lat: 10.19, lng: -68.01 },
];

const MARACAIBO_SECTORS = [
  { id: "la-lago", label: "La Lago", lat: 10.67, lng: -71.61 },
  { id: "bella-vista-mbo", label: "Bella Vista", lat: 10.68, lng: -71.62 },
  { id: "veritas", label: "Veritas", lat: 10.66, lng: -71.63 },
];

const SECTORS_BY_CITY: Record<
  string,
  { id: string; label: string; lat: number; lng: number }[]
> = {
  caracas: CARACAS_SECTORS,
  valencia: VALENCIA_SECTORS,
  maracaibo: MARACAIBO_SECTORS,
};

export function normalizePlaceQuery(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function norm(s: string) {
  return normalizePlaceQuery(s);
}

/** Sugerencias locales por ciudad (rápidas, sin red). */
export function suggestLocalSectors(
  cityId: string,
  query: string,
  limit = 8,
): SectorSuggestion[] {
  const q = norm(query);
  const rows = SECTORS_BY_CITY[cityId] ?? [];
  const scored = rows
    .map((s) => {
      const label = norm(s.label);
      const id = norm(s.id.replace(/-/g, " "));
      let score = 0;
      if (!q) score = 1;
      else if (label.startsWith(q) || id.startsWith(q)) score = 3;
      else if (label.includes(q) || id.includes(q)) score = 2;
      else if (q.includes(label) && label.length > 3) score = 1;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.s.label.localeCompare(b.s.label))
    .slice(0, limit);

  return scored.map(({ s }) => ({
    id: `${cityId}:${s.id}`,
    label: s.label,
    cityId,
    lat: s.lat,
    lng: s.lng,
    source: "local" as const,
  }));
}

export function resolveListingCoords(input: {
  cityId: string;
  neighborhood: string;
  lat?: number | null;
  lng?: number | null;
}): LatLng {
  if (
    typeof input.lat === "number" &&
    typeof input.lng === "number" &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    return { lat: input.lat, lng: input.lng };
  }

  const n = norm(input.neighborhood);
  const local = suggestLocalSectors(input.cityId, input.neighborhood, 1);
  if (n && local[0]) {
    return { lat: local[0].lat, lng: local[0].lng };
  }

  return CITY_CENTROIDS[input.cityId] ?? CITY_CENTROIDS.caracas;
}
