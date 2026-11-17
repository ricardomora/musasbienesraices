"use client";

import { useCallback, useEffect, useState } from "react";
import type { MapTheme } from "@/lib/map-tiles";
import { parseAppTheme } from "@/lib/theme";

const MAP_OVERRIDE_KEY = "musas.mapThemeOverride";

/**
 * Por defecto: mapa claro.
 * Si el usuario fuerza Claro/Oscuro en el toggle del mapa, se guarda override.
 */
export function useMapTheme() {
  const [theme, setThemeState] = useState<MapTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const override = parseAppTheme(
        window.localStorage.getItem(MAP_OVERRIDE_KEY),
      );
      setThemeState(override ?? "light");
    } catch {
      setThemeState("light");
    }
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== MAP_OVERRIDE_KEY) return;
      const o = parseAppTheme(e.newValue);
      setThemeState(o ?? "light");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: MapTheme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(MAP_OVERRIDE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle, ready };
}
