"use client";

import { Moon, Sun } from "lucide-react";
import type { MapTheme } from "@/lib/map-tiles";
import { cn } from "@/lib/utils";

type MapThemeToggleProps = {
  theme: MapTheme;
  onChange: (theme: MapTheme) => void;
  className?: string;
};

export function MapThemeToggle({
  theme,
  onChange,
  className,
}: MapThemeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-border bg-card/90 p-0.5 text-xs backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Tema del mapa (opcional, independiente)"
    >
      <button
        type="button"
        onClick={() => onChange("light")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
          theme === "light"
            ? "bg-neon text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={theme === "light"}
      >
        <Sun className="size-3" aria-hidden />
        Mapa claro
      </button>
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
          theme === "dark"
            ? "bg-neon text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={theme === "dark"}
      >
        <Moon className="size-3" aria-hidden />
        Mapa oscuro
      </button>
    </div>
  );
}
