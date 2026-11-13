"use client";

import { useCallback, useEffect, useState } from "react";
import type { MapTheme } from "@/lib/map-tiles";
import { APP_THEME_STORAGE_KEY, parseAppTheme } from "@/lib/theme";

const MAP_OVERRIDE_KEY = "musas.mapThemeOverride";

/**
 * Por defecto el mapa sigue el tema de la app.
 * Si el usuario fuerza Claro/Oscuro en el mapa, se guarda override.
 */
export function useMapTheme() {
  const [theme, setThemeState] = useState<MapTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const override = parseAppTheme(
        window.localStorage.getItem(MAP_OVERRIDE_KEY),
      );
      if (override) {
        setThemeState(override);
      } else {
        const app = parseAppTheme(
          window.localStorage.getItem(APP_THEME_STORAGE_KEY),
        );
        setThemeState(app ?? "dark");
      }
    } catch {
      setThemeState("dark");
    }
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === MAP_OVERRIDE_KEY && e.newValue) {
        const o = parseAppTheme(e.newValue);
        if (o) setThemeState(o);
        return;
      }
      if (e.key === APP_THEME_STORAGE_KEY) {
        const override = parseAppTheme(
          window.localStorage.getItem(MAP_OVERRIDE_KEY),
        );
        if (override) return;
        const app = parseAppTheme(e.newValue);
        if (app) setThemeState(app);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Follow app theme changes in same tab (ThemeProvider writes storage + class)
  useEffect(() => {
    const obs = new MutationObserver(() => {
      try {
        const override = parseAppTheme(
          window.localStorage.getItem(MAP_OVERRIDE_KEY),
        );
        if (override) return;
        const isDark = document.documentElement.classList.contains("dark");
        setThemeState(isDark ? "dark" : "light");
      } catch {
        /* ignore */
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
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
