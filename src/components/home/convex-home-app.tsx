"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { CITIES, type CityId } from "@/data/cities";
import {
  BUDGET_OPTIONS,
  filterListings,
  type Listing,
  type PropertyType,
} from "@/data/listings";
import { useAuthFavorites } from "@/hooks/use-auth-favorites";
import { usePublishedListings } from "@/hooks/use-musas-listings";
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

export function ConvexHomeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { count, favoriteSet, isFavorite, toggleFavorite } = useAuthFavorites();

  const urlKey = searchParams.toString();
  const cityId = parseCity(searchParams.get("ciudad"));
  const type = parseType(searchParams.get("tipo"));
  const budgetId = searchParams.get("presupuesto") ?? "any";
  const favoritesOnly = searchParams.get("favoritos") === "1";

  const [search, setSearch] = useState<HeroSearchValues>({
    mode: favoritesOnly ? "favoritos" : "comprar",
    cityId,
    type,
    budgetId,
  });
  const [syncedUrlKey, setSyncedUrlKey] = useState(urlKey);
  const [typePill, setTypePill] = useState<"todos" | PropertyType>(
    type !== "all" ? type : "todos",
  );

  if (syncedUrlKey !== urlKey) {
    setSyncedUrlKey(urlKey);
    setSearch({
      mode: favoritesOnly ? "favoritos" : "comprar",
      cityId,
      type,
      budgetId,
    });
    if (type !== "all") setTypePill(type);
  }

  const budgetMaxUsd =
    BUDGET_OPTIONS.find((o) => o.id === budgetId)?.maxUsd ?? null;
  const effectiveType = typePill === "todos" ? type : typePill;

  const { listings: published, loading } = usePublishedListings({
    cityId,
    type: effectiveType === "all" ? undefined : effectiveType,
    budgetMaxUsd,
  });

  const asListings: Listing[] = useMemo(
    () =>
      published.map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.type,
        cityId: p.cityId as CityId,
        neighborhood: p.neighborhood,
        title: p.title,
        badge: p.badge,
        priceUsd: p.priceUsd,
        beds: p.beds,
        baths: p.baths,
        areaM2: p.areaM2,
        image: p.image,
        alt: p.alt,
        description: p.description,
        administrationUsd: p.administrationUsd,
        features: p.features,
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
    !favoritesOnly;
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
    const next = {
      cityId: search.cityId,
      type: search.type,
      budgetId: search.budgetId,
      favoritesOnly: search.mode === "favoritos",
    };
    if (search.type !== "all") setTypePill(search.type);
    else setTypePill("todos");
    syncQuery(next);
    scrollToListings();
  }, [search, syncQuery, scrollToListings]);

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
              syncQuery({
                cityId: next.cityId,
                type: next.type,
                budgetId: next.budgetId,
                favoritesOnly: next.mode === "favoritos",
              });
            }
            return next;
          });
        }}
        onSearch={runSearch}
      />
      {loading ? (
        <p className="py-20 text-center text-muted-foreground">
          Cargando inmuebles en venta…
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
          onSelectListing={(listing) => {
            router.push(`/inmuebles/${listing.slug}`);
          }}
          onResetFilters={resetFilters}
        />
      )}
      <HowItWorks productLive onPublish={goPublish} />
      <div className="border-t border-white/5 py-6 text-center text-sm text-muted-foreground">
        <Link href="/preferencial" className="text-neon hover:underline">
          Atención Preferencial
        </Link>
        {" · "}
        <Link href="/dashboard/inmuebles" className="hover:text-white">
          Mis inmuebles
        </Link>
      </div>
    </main>
  );
}
