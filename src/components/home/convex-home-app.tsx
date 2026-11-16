"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CITIES, type CityId } from "@/data/cities";
import {
  QUICK_SEARCH_CHIPS,
  budgetsForOperation,
  filterListings,
  type Listing,
  type OperationType,
  type PropertyType,
} from "@/data/listings";
import { useAuthFavorites } from "@/hooks/use-auth-favorites";
import { usePublishedListings } from "@/hooks/use-musas-listings";
import { HomeHeader } from "./home-header";
import { HeroSearch, type HeroSearchValues } from "./hero-search";
import { HowItWorks } from "./how-it-works";
import { ListingsGrid, type ExploreView } from "./listings-grid";

function parseCity(value: string | null): CityId | "all" {
  if (!value) return "all";
  return CITIES.some((c) => c.id === value) ? (value as CityId) : "all";
}

function parseType(value: string | null): PropertyType | "all" {
  if (value === "apartamentos" || value === "casas") return value;
  return "all";
}

function parseOperation(value: string | null): OperationType {
  return value === "alquiler" ? "alquiler" : "venta";
}

function modeFromParams(
  favoritesOnly: boolean,
  operation: OperationType,
): HeroSearchValues["mode"] {
  if (favoritesOnly) return "favoritos";
  return operation === "alquiler" ? "alquilar" : "comprar";
}

export function ConvexHomeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { count, favoriteSet, isFavorite, toggleFavorite } = useAuthFavorites();

  const urlKey = searchParams.toString();
  const cityId = parseCity(searchParams.get("ciudad"));
  const type = parseType(searchParams.get("tipo"));
  const operation = parseOperation(searchParams.get("op"));
  const budgetId = searchParams.get("presupuesto") ?? "any";
  const favoritesOnly = searchParams.get("favoritos") === "1";
  const q = searchParams.get("q") ?? "";
  const sector = searchParams.get("sector") ?? "";
  const verifiedOnly = searchParams.get("revisado") === "1";
  const exploreView: ExploreView =
    searchParams.get("vista") === "mapa" ? "mapa" : "lista";

  const [search, setSearch] = useState<HeroSearchValues>({
    mode: modeFromParams(favoritesOnly, operation),
    cityId,
    type,
    budgetId,
    q,
    sector,
    verifiedOnly,
  });
  const [syncedUrlKey, setSyncedUrlKey] = useState(urlKey);
  const [typePill, setTypePill] = useState<"todos" | PropertyType>(
    type !== "all" ? type : "todos",
  );

  if (syncedUrlKey !== urlKey) {
    setSyncedUrlKey(urlKey);
    setSearch({
      mode: modeFromParams(favoritesOnly, operation),
      cityId,
      type,
      budgetId,
      q,
      sector,
      verifiedOnly,
    });
    if (type !== "all") setTypePill(type);
  }

  const activeOperation: OperationType =
    search.mode === "alquilar" ? "alquiler" : operation;
  const budgetMaxUsd =
    budgetsForOperation(activeOperation).find((o) => o.id === budgetId)
      ?.maxUsd ?? null;
  const effectiveType = typePill === "todos" ? type : typePill;

  const { listings: published, loading } = usePublishedListings({
    cityId,
    type: effectiveType === "all" ? undefined : effectiveType,
    operationType: favoritesOnly ? undefined : activeOperation,
    budgetMaxUsd,
    q,
    sector,
    verifiedOnly,
  });

  const asListings: Listing[] = useMemo(
    () =>
      published.map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.type,
        operationType: p.operationType,
        cityId: p.cityId as CityId,
        neighborhood: p.neighborhood,
        title: p.title,
        badge: p.badge,
        trustBadge: p.trustBadge,
        contactWhatsapp: p.contactWhatsapp,
        priceUsd: p.priceUsd,
        beds: p.beds,
        baths: p.baths,
        areaM2: p.areaM2,
        image: p.image,
        images: p.images,
        alt: p.alt,
        description: p.description,
        administrationUsd: p.administrationUsd,
        features: p.features,
        lat: p.lat,
        lng: p.lng,
      })),
    [published],
  );

  const visible = useMemo(
    () =>
      filterListings(
        asListings,
        {
          cityId: "all",
          type: "all",
          budgetMaxUsd: null,
          favoritesOnly,
        },
        favoriteSet,
      ),
    [asListings, favoritesOnly, favoriteSet],
  );

  const noActiveFilters =
    cityId === "all" &&
    typePill === "todos" &&
    budgetId === "any" &&
    !favoritesOnly &&
    !q &&
    !sector &&
    !verifiedOnly;
  const catalogEmpty = !loading && visible.length === 0 && noActiveFilters;

  const goPublish = useCallback(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    router.push("/publicar");
  }, [isSignedIn, router]);

  const syncQuery = useCallback(
    (next: {
      cityId: CityId | "all";
      type: PropertyType | "all";
      budgetId: string;
      favoritesOnly: boolean;
      operation?: OperationType;
      q?: string;
      sector?: string;
      verifiedOnly?: boolean;
      view?: ExploreView;
    }) => {
      const params = new URLSearchParams();
      if (next.cityId !== "all") params.set("ciudad", next.cityId);
      if (next.type !== "all") params.set("tipo", next.type);
      if (next.operation === "alquiler") params.set("op", "alquiler");
      if (next.budgetId !== "any") params.set("presupuesto", next.budgetId);
      if (next.favoritesOnly) params.set("favoritos", "1");
      if (next.q?.trim()) params.set("q", next.q.trim());
      if (next.sector?.trim()) params.set("sector", next.sector.trim());
      if (next.verifiedOnly) params.set("revisado", "1");
      if ((next.view ?? exploreView) === "mapa") params.set("vista", "mapa");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, exploreView],
  );

  const scrollToListings = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById("inmuebles")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const operationFromMode = (
    mode: HeroSearchValues["mode"],
  ): OperationType => (mode === "alquilar" ? "alquiler" : "venta");

  const runSearch = useCallback(
    (view: ExploreView = "lista") => {
      const next = {
        cityId: search.cityId,
        type: search.type,
        budgetId: search.budgetId,
        favoritesOnly: search.mode === "favoritos",
        operation: operationFromMode(search.mode),
        q: search.q,
        sector: search.sector,
        verifiedOnly: search.verifiedOnly,
        view,
      };
      if (search.type !== "all") setTypePill(search.type);
      else setTypePill("todos");
      syncQuery(next);
      scrollToListings();
    },
    [search, syncQuery, scrollToListings],
  );

  const applyChip = useCallback(
    (chipId: string) => {
      const chip = QUICK_SEARCH_CHIPS.find((c) => c.id === chipId);
      if (!chip) return;
      const op = chip.operationType ?? activeOperation;
      const next: HeroSearchValues = {
        mode: op === "alquiler" ? "alquilar" : "comprar",
        cityId: (chip.cityId as CityId | "all") ?? "all",
        type: (chip.type as PropertyType | "all") ?? "all",
        budgetId: chip.budgetId ?? "any",
        q: "",
        sector: chip.sector ?? "",
        verifiedOnly: !!chip.verifiedOnly,
      };
      setSearch(next);
      if (next.type !== "all") setTypePill(next.type);
      else setTypePill("todos");
      syncQuery({
        cityId: next.cityId,
        type: next.type,
        budgetId: next.budgetId,
        favoritesOnly: false,
        operation: op,
        q: "",
        sector: next.sector,
        verifiedOnly: next.verifiedOnly,
      });
      scrollToListings();
    },
    [syncQuery, scrollToListings, activeOperation],
  );

  const resetFilters = useCallback(() => {
    setSearch({
      mode: "comprar",
      cityId: "all",
      type: "all",
      budgetId: "any",
      q: "",
      sector: "",
      verifiedOnly: false,
    });
    setTypePill("todos");
    syncQuery({
      cityId: "all",
      type: "all",
      budgetId: "any",
      favoritesOnly: false,
      operation: "venta",
      q: "",
      sector: "",
      verifiedOnly: false,
    });
    scrollToListings();
  }, [syncQuery, scrollToListings]);

  return (
    <main className="flex-1 bg-background">
      <HomeHeader
        favoriteCount={count}
        onShowFavorites={() => {
          setSearch((s) => ({ ...s, mode: "favoritos" }));
          syncQuery({
            cityId: search.cityId,
            type: search.type,
            budgetId: search.budgetId,
            favoritesOnly: true,
            operation: operationFromMode(search.mode),
            q: search.q,
            sector: search.sector,
            verifiedOnly: search.verifiedOnly,
          });
          scrollToListings();
        }}
        onPublish={goPublish}
      />
      <HeroSearch
        values={search}
        favoriteCount={count}
        onChange={(partial) => {
          setSearch((prev) => {
            const next = { ...prev, ...partial };
            if (partial.mode) {
              const op = operationFromMode(next.mode);
              const budgetStillValid = budgetsForOperation(op).some(
                (b) => b.id === next.budgetId,
              );
              if (!budgetStillValid) next.budgetId = "any";
              syncQuery({
                cityId: next.cityId,
                type: next.type,
                budgetId: next.budgetId,
                favoritesOnly: next.mode === "favoritos",
                operation: op,
                q: next.q,
                sector: next.sector,
                verifiedOnly: next.verifiedOnly,
              });
            }
            return next;
          });
        }}
        onSearch={() => runSearch("lista")}
        onChipApply={applyChip}
      />
      {loading ? (
        <p className="py-20 text-center text-muted-foreground">
          Cargando inmuebles…
        </p>
      ) : (
        <ListingsGrid
          listings={visible}
          typeFilter={typePill}
          onTypeFilterChange={setTypePill}
          isFavorite={isFavorite}
          onToggleFavorite={(id) => {
            void toggleFavorite(id);
          }}
          favoritesOnly={favoritesOnly}
          catalogEmpty={catalogEmpty}
          operationLabel={
            favoritesOnly
              ? undefined
              : activeOperation === "alquiler"
                ? "alquiler"
                : "venta"
          }
          view={exploreView}
          onViewChange={(next) => {
            syncQuery({
              cityId: search.cityId,
              type: typePill === "todos" ? search.type : typePill,
              budgetId: search.budgetId,
              favoritesOnly,
              operation: activeOperation,
              q: search.q,
              sector: search.sector,
              verifiedOnly: search.verifiedOnly,
              view: next,
            });
            scrollToListings();
          }}
          onSelectListing={(listing) => {
            router.push(`/inmuebles/${listing.slug}`);
          }}
          onResetFilters={resetFilters}
        />
      )}
      <HowItWorks productLive onPublish={goPublish} />
    </main>
  );
}
