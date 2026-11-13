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
];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
  if (input.cityId === "caracas" && n) {
    for (const sector of CARACAS_SECTORS) {
      const label = norm(sector.label);
      if (
        n.includes(label) ||
        label.includes(n) ||
        n.includes(sector.id.replace(/-/g, " "))
      ) {
        return { lat: sector.lat, lng: sector.lng };
      }
    }
  }

  return CITY_CENTROIDS[input.cityId] ?? CITY_CENTROIDS.caracas;
}
