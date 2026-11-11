"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LISTINGS, type Listing, type PropertyType } from "@/data/listings";
import { BACKEND_CONFIGURED } from "@/lib/backend";

export type MusasListingCard = {
  id: string;
  slug: string;
  type: PropertyType;
  cityId: string;
  neighborhood: string;
  title: string;
  badge?: string;
  priceUsd: number;
  administrationUsd: number;
  beds: number;
  baths: number;
  areaM2: number;
  image: string;
  images: string[];
  alt: string;
  description: string;
  features: string[];
  source: "convex" | "local";
};

function fromLocal(listing: Listing): MusasListingCard {
  return {
    id: listing.id,
    slug: listing.slug,
    type: listing.type,
    cityId: listing.cityId,
    neighborhood: listing.neighborhood,
    title: listing.title,
    badge: listing.badge,
    priceUsd: listing.priceUsd,
    administrationUsd: listing.administrationUsd,
    beds: listing.beds,
    baths: listing.baths,
    areaM2: listing.areaM2,
    image: listing.image,
    images: [listing.image],
    alt: listing.alt,
    description: listing.description,
    features: listing.features,
    source: "local",
  };
}

export function usePublishedListings(filters: {
  cityId?: string | "all";
  type?: PropertyType | "all";
  budgetMaxUsd?: number | null;
}) {
  const cityId =
    !filters.cityId || filters.cityId === "all" ? undefined : filters.cityId;
  const type =
    !filters.type || filters.type === "all" ? undefined : filters.type;

  const convexRows = useQuery(
    api.listings.listPublished,
    BACKEND_CONFIGURED
      ? {
          cityId,
          type,
          budgetMaxUsd: filters.budgetMaxUsd ?? undefined,
        }
      : "skip",
  );

  if (!BACKEND_CONFIGURED) {
    return {
      listings: LISTINGS.map(fromLocal),
      loading: false,
      source: "local" as const,
    };
  }

  if (convexRows === undefined) {
    return { listings: [] as MusasListingCard[], loading: true, source: "convex" as const };
  }

  const listings: MusasListingCard[] = convexRows.map((row) => ({
    id: row._id,
    slug: row.slug,
    type: row.type,
    cityId: row.cityId,
    neighborhood: row.neighborhood,
    title: row.title,
    badge: row.badge,
    priceUsd: row.priceUsd,
    administrationUsd: row.administrationUsd,
    beds: row.beds,
    baths: row.baths,
    areaM2: row.areaM2,
    image: row.images[0] ?? "/villa-dusk.png",
    images: row.images,
    alt: row.alt ?? row.title,
    description: row.description,
    features: row.features,
    source: "convex",
  }));

  return { listings, loading: false, source: "convex" as const };
}
