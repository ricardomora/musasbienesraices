"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CITIES, type CityId } from "@/data/cities";
import {
  BUDGET_OPTIONS,
  filterListings,
  LISTINGS,
  type PropertyType,
} from "@/data/listings";
import { useFavorites } from "@/hooks/use-favorites";
import { HomeHeader } from "./home-header";
import { HeroSearch, type HeroSearchValues } from "./hero-search";
import { HowItWorks } from "./how-it-works";
import { ListingsGrid } from "./listings-grid";

function parseCity(value: string | null): CityId | "all" {
  if (!value) return "all";
  return CITIES.some((c) => c.id === value) ? (value as CityId) : "all";
}

function parseType(value: string | null): PropertyType | "all" {
  if (value === "apartamentos" || value === "casas") return value;
  return "all";
}

export function HomeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count, favoriteSet, isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState<HeroSearchValues>(() => ({
    mode: "comprar",
    cityId: parseCity(searchParams.get("ciudad")),
    type: parseType(searchParams.get("tipo")),
    budgetId: searchParams.get("presupuesto") ?? "any",
  }));
  const [applied, setApplied] = useState(() => ({
    cityId: parseCity(searchParams.get("ciudad")),
    type: parseType(searchParams.get("tipo")),
    budgetId: searchParams.get("presupuesto") ?? "any",
    favoritesOnly: searchParams.get("favoritos") === "1",
  }));
  const [typePill, setTypePill] = useState<"todos" | PropertyType>("todos");

  useEffect(() => {
    const cityId = parseCity(searchParams.get("ciudad"));
    const type = parseType(searchParams.get("tipo"));
    const budgetId = searchParams.get("presupuesto") ?? "any";
    const favoritesOnly = searchParams.get("favoritos") === "1";
    setSearch({
      mode: favoritesOnly ? "favoritos" : "comprar",
      cityId,
      type,
      budgetId,
    });
    setApplied({ cityId, type, budgetId, favoritesOnly });
    if (type !== "all") setTypePill(type);
  }, [searchParams]);

  const budgetMaxUsd =
    BUDGET_OPTIONS.find((o) => o.id === applied.budgetId)?.maxUsd ?? null;

  const visible = useMemo(() => {
    const effectiveType = typePill === "todos" ? applied.type : typePill;
    return filterListings(
      LISTINGS,
      {
        cityId: applied.cityId,
        type: effectiveType,
        budgetMaxUsd,
        favoritesOnly: applied.favoritesOnly,
      },
      favoriteSet,
    );
  }, [applied, budgetMaxUsd, favoriteSet, typePill]);

  const syncQuery = useCallback(
    (next: {
      cityId: CityId | "all";
      type: PropertyType | "all";
      budgetId: string;
      favoritesOnly: boolean;
    }) => {
      const params = new URLSearchParams();
      if (next.cityId !== "all") params.set("ciudad", next.cityId);
      if (next.type !== "all") params.set("tipo", next.type);
      if (next.budgetId !== "any") params.set("presupuesto", next.budgetId);
      if (next.favoritesOnly) params.set("favoritos", "1");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const runSearch = useCallback(() => {
    const favoritesOnly = search.mode === "favoritos";
    const next = {
      cityId: search.cityId,
      type: search.type,
      budgetId: search.budgetId,
      favoritesOnly,
    };
    setApplied(next);
    if (search.type !== "all") setTypePill(search.type);
    else setTypePill("todos");
    syncQuery(next);
    requestAnimationFrame(() => {
      document.getElementById("inmuebles")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [search, syncQuery]);

  const applyFavoritesMode = useCallback(
    (favoritesOnly: boolean) => {
      setSearch((prev) => ({
        ...prev,
        mode: favoritesOnly ? "favoritos" : "comprar",
      }));
      setApplied((prev) => {
        const next = { ...prev, favoritesOnly };
        syncQuery(next);
        return next;
      });
      requestAnimationFrame(() => {
        document.getElementById("inmuebles")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [syncQuery],
  );

  const onHeroChange = (partial: Partial<HeroSearchValues>) => {
    setSearch((prev) => {
      const next = { ...prev, ...partial };
      if (partial.mode === "favoritos") {
        const appliedNext = {
          cityId: next.cityId,
          type: next.type,
          budgetId: next.budgetId,
          favoritesOnly: true,
        };
        setApplied(appliedNext);
        syncQuery(appliedNext);
      }
      if (partial.mode === "comprar" && prev.mode === "favoritos") {
        const appliedNext = {
          cityId: next.cityId,
          type: next.type,
          budgetId: next.budgetId,
          favoritesOnly: false,
        };
        setApplied(appliedNext);
        syncQuery(appliedNext);
      }
      return next;
    });
  };

  return (
    <main className="flex-1 bg-background">
      <HomeHeader
        favoriteCount={count}
        onShowFavorites={() => applyFavoritesMode(true)}
      />
      <HeroSearch
        values={search}
        favoriteCount={count}
        onChange={onHeroChange}
        onSearch={runSearch}
      />
      <ListingsGrid
        listings={visible}
        typeFilter={typePill}
        onTypeFilterChange={setTypePill}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        favoritesOnly={applied.favoritesOnly}
      />
      <HowItWorks />
    </main>
  );
}
