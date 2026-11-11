"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CITIES, type CityId } from "@/data/cities";
import {
  BUDGET_OPTIONS,
  filterListings,
  LISTINGS,
  type Listing,
  type PropertyType,
} from "@/data/listings";
import { useFavorites } from "@/hooks/use-favorites";
import { DemoInfoDialog, type DemoInfoKind } from "./demo-info-dialog";
import { HomeHeader } from "./home-header";
import { HeroSearch, type HeroSearchValues } from "./hero-search";
import { HowItWorks } from "./how-it-works";
import { ListingsGrid } from "./listings-grid";
import { PropertyDetailDialog } from "./property-detail-dialog";

function parseCity(value: string | null): CityId | "all" {
  if (!value) return "all";
  return CITIES.some((c) => c.id === value) ? (value as CityId) : "all";
}

function parseType(value: string | null): PropertyType | "all" {
  if (value === "apartamentos" || value === "casas") return value;
  return "all";
}

function filtersFromParams(searchParams: URLSearchParams) {
  const cityId = parseCity(searchParams.get("ciudad"));
  const type = parseType(searchParams.get("tipo"));
  const budgetId = searchParams.get("presupuesto") ?? "any";
  const favoritesOnly = searchParams.get("favoritos") === "1";
  return {
    cityId,
    type,
    budgetId,
    favoritesOnly,
    search: {
      mode: (favoritesOnly ? "favoritos" : "comprar") as HeroSearchValues["mode"],
      cityId,
      type,
      budgetId,
    },
  };
}

export function HomeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count, favoriteSet, isFavorite, toggleFavorite } = useFavorites();

  const urlKey = searchParams.toString();
  const fromUrl = useMemo(
    () => filtersFromParams(new URLSearchParams(urlKey)),
    [urlKey],
  );

  const [search, setSearch] = useState<HeroSearchValues>(fromUrl.search);
  const [syncedUrlKey, setSyncedUrlKey] = useState(urlKey);
  const [typePill, setTypePill] = useState<"todos" | PropertyType>(() =>
    fromUrl.type !== "all" ? fromUrl.type : "todos",
  );
  const [selected, setSelected] = useState<Listing | null>(null);
  const [info, setInfo] = useState<DemoInfoKind | null>(null);

  if (syncedUrlKey !== urlKey) {
    setSyncedUrlKey(urlKey);
    setSearch(fromUrl.search);
    if (fromUrl.type !== "all") setTypePill(fromUrl.type);
  }

  const applied = fromUrl;
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

  const scrollToListings = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById("inmuebles")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const runSearch = useCallback(() => {
    const favoritesOnly = search.mode === "favoritos";
    const next = {
      cityId: search.cityId,
      type: search.type,
      budgetId: search.budgetId,
      favoritesOnly,
    };
    if (search.type !== "all") setTypePill(search.type);
    else setTypePill("todos");
    syncQuery(next);
    scrollToListings();
  }, [search, syncQuery, scrollToListings]);

  const applyFavoritesMode = useCallback(
    (favoritesOnly: boolean) => {
      setSearch((prev) => ({
        ...prev,
        mode: favoritesOnly ? "favoritos" : "comprar",
      }));
      syncQuery({
        cityId: search.cityId,
        type: search.type,
        budgetId: search.budgetId,
        favoritesOnly,
      });
      scrollToListings();
    },
    [search, syncQuery, scrollToListings],
  );

  const resetFilters = useCallback(() => {
    setSearch({
      mode: "comprar",
      cityId: "all",
      type: "all",
      budgetId: "any",
    });
    setTypePill("todos");
    syncQuery({
      cityId: "all",
      type: "all",
      budgetId: "any",
      favoritesOnly: false,
    });
    scrollToListings();
  }, [syncQuery, scrollToListings]);

  const onHeroChange = (partial: Partial<HeroSearchValues>) => {
    setSearch((prev) => {
      const next = { ...prev, ...partial };
      return next;
    });

    if (partial.mode === "favoritos" || partial.mode === "comprar") {
      const nextMode = partial.mode;
      const nextValues = { ...search, ...partial };
      syncQuery({
        cityId: nextValues.cityId,
        type: nextValues.type,
        budgetId: nextValues.budgetId,
        favoritesOnly: nextMode === "favoritos",
      });
    }
  };

  return (
    <main className="flex-1 bg-background">
      <HomeHeader
        favoriteCount={count}
        onShowFavorites={() => applyFavoritesMode(true)}
        onPublish={() => setInfo("sell")}
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
        onSelectListing={(listing) => {
          setSelected(listing);
          router.push(`/inmuebles/${listing.slug}`);
        }}
        onResetFilters={resetFilters}
      />
      <HowItWorks onPublish={() => setInfo("sell")} />

      <PropertyDetailDialog
        listing={selected}
        open={false}
        liked={selected ? isFavorite(selected.id) : false}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onToggleFavorite={() => {
          if (selected) toggleFavorite(selected.id);
        }}
        onRequestVisit={() => setInfo("visit")}
      />

      <DemoInfoDialog
        kind={info}
        open={!!info}
        onOpenChange={(open) => {
          if (!open) setInfo(null);
        }}
        onContinueExploring={() => {
          setSelected(null);
          scrollToListings();
        }}
      />
    </main>
  );
}
