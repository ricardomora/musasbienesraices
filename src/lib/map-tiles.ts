/**
 * Capas del mapa Musas.
 *
 * - OpenStreetMap (.org) **no** pide API key.
 * - Carto dark_all sí (por eso falló antes).
 * - Opcional: `NEXT_PUBLIC_MAPTILER_API_KEY` (maptiler.com, datos OSM) → dark/light más limpios.
 */

export type MapTheme = "light" | "dark";

export type MapTileConfig = {
  url: string;
  attribution: string;
  /** Leaflet subdomains si el URL usa {s} */
  subdomains?: string;
};

const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const ESRI_DARK: MapTileConfig = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  attribution: `Tiles &copy; <a href="https://www.esri.com/">Esri</a> · ${OSM_ATTR}`,
};

const OSM_LIGHT: MapTileConfig = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: OSM_ATTR,
  subdomains: "abc",
};

function mapTilerKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY?.trim();
  return key || undefined;
}

/** Config según tema. Con MapTiler key → calles reales light/dark. */
export function getMapTileConfig(theme: MapTheme): MapTileConfig {
  const key = mapTilerKey();
  if (key) {
    if (theme === "dark") {
      return {
        url: `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${key}`,
        attribution: `${OSM_ATTR} · <a href="https://www.maptiler.com/">MapTiler</a>`,
      };
    }
    return {
      url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
      attribution: `${OSM_ATTR} · <a href="https://www.maptiler.com/">MapTiler</a>`,
    };
  }

  return theme === "dark" ? ESRI_DARK : OSM_LIGHT;
}

export function mapThemeUsesPremiumTiles(): boolean {
  return Boolean(mapTilerKey());
}
