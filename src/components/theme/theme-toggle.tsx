"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /** Compact icon-only for dense headers */
  compact?: boolean;
};

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={cn(
          "interactive-surface inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/80 text-foreground hover:border-neon/45",
          className,
        )}
        aria-label={
          theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
        }
      >
        {theme === "dark" ? (
          <Sun className="size-3.5" aria-hidden />
        ) : (
          <Moon className="size-3.5" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-border bg-card/80 p-0.5 text-xs backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Tema de la app"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
          theme === "light"
            ? "bg-neon text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={theme === "light"}
      >
        <Sun className="size-3" aria-hidden />
        Claro
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
          theme === "dark"
            ? "bg-neon text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={theme === "dark"}
      >
        <Moon className="size-3" aria-hidden />
        Oscuro
      </button>
    </div>
  );
}
