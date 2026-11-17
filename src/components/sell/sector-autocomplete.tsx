"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  suggestLocalSectors,
  type LatLng,
  type SectorSuggestion,
} from "@/data/geo";
import { cn } from "@/lib/utils";

type SectorAutocompleteProps = {
  cityId: string;
  value: string;
  onChange: (value: string) => void;
  onSelectPlace: (place: { label: string; coords: LatLng }) => void;
  placeholder?: string;
};

export function SectorAutocomplete({
  cityId,
  value,
  onChange,
  onSelectPlace,
  placeholder = "Escribe y elige un sector…",
}: SectorAutocompleteProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [remote, setRemote] = useState<SectorSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const local = suggestLocalSectors(cityId, value, 8);
  const localIds = new Set(local.map((s) => s.label.toLowerCase()));
  const merged: SectorSuggestion[] = [
    ...local,
    ...remote.filter((r) => !localIds.has(r.label.toLowerCase())),
  ].slice(0, 10);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setRemote([]);
      setLoading(false);
      return;
    }
    const t = window.setTimeout(() => {
      setLoading(true);
      void fetch(
        `/api/geocode?q=${encodeURIComponent(q)}&cityId=${encodeURIComponent(cityId)}`,
      )
        .then((r) => r.json())
        .then((data: { results?: SectorSuggestion[] }) => {
          setRemote(data.results ?? []);
        })
        .catch(() => setRemote([]))
        .finally(() => setLoading(false));
    }, 280);
    return () => window.clearTimeout(t);
  }, [value, cityId]);

  useEffect(() => {
    setActive(0);
  }, [value, cityId, merged.length]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function pick(item: SectorSuggestion) {
    onChange(item.label);
    onSelectPlace({
      label: item.label,
      coords: { lat: item.lat, lng: item.lng },
    });
    setOpen(false);
  }

  const showList =
    open && (merged.length > 0 || loading || value.trim().length >= 1);

  return (
    <div
      ref={rootRef}
      className={cn("relative", showList ? "z-[1200]" : "z-10")}
    >
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neon/80"
          aria-hidden
        />
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              return;
            }
            if (!showList || merged.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => (i + 1) % merged.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + merged.length) % merged.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const item = merged[active];
              if (item) pick(item);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full rounded-xl border border-border bg-background py-3 pr-10 pl-10 text-foreground"
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Ver sugerencias"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-neon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className="size-4" aria-hidden />
        </button>
      </div>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-[1200] mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-2xl"
        >
          {value.trim().length === 0 ? (
            <li className="px-3 py-1.5 text-[11px] text-muted-foreground">
              Sectores frecuentes en esta ciudad
            </li>
          ) : null}
          {merged.map((item, i) => (
            <li key={item.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={cn(
                  "flex w-full flex-col items-start px-3 py-2.5 text-left text-sm",
                  i === active
                    ? "bg-neon/15 text-foreground"
                    : "text-foreground hover:bg-accent",
                )}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  // Evita que el input pierda foco antes del click.
                  e.preventDefault();
                  pick(item);
                }}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {item.source === "local"
                    ? "Sector conocido · actualiza el mapa"
                    : "Mapa · coloca el pin aquí"}
                </span>
              </button>
            </li>
          ))}
          {loading ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              Buscando en el mapa…
            </li>
          ) : null}
          {!loading && merged.length === 0 && value.trim().length >= 1 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              Sin sugerencias. Prueba otro nombre o marca el pin en el mapa.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
