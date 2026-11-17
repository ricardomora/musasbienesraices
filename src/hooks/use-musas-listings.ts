"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  LISTINGS,
  listingOperation,
  type Listing,
  type OperationType,
  type PropertyType,
} from "@/data/listings";
import { BACKEND_CONFIGURED } from "@/lib/backend";

export type MusasListingCard = {
  id: string;
  slug: string;
  type: PropertyType;
  operationType: OperationType;
  cityId: string;
  neighborhood: string;
  title: string;
  badge?: string;
  trustBadge?: "none" | "musas_reviewed";
  contactWhatsapp?: string;
  priceUsd: number;
  administrationUsd: number;
  beds: number;
  baths: number;
  areaM2: number;
  lotM2?: number;
  image: string;
  images: string[];
  alt: string;
  description: string;
  features: string[];
  lat?: number;
  lng?: number;
  source: "convex" | "local";
};

function fromLocal(listing: Listing): MusasListingCard {
  return {
    id: listing.id,
    slug: listing.slug,
    type: listing.type,
    operationType: listingOperation(listing),
    cityId: listing.cityId,
    neighborhood: listing.neighborhood,
    title: listing.title,
    badge: listing.badge,
    trustBadge: listing.trustBadge,
    contactWhatsapp: listing.contactWhatsapp,
    priceUsd: listing.priceUsd,
    administrationUsd: listing.administrationUsd,
    beds: listing.beds,
    baths: listing.baths,
    areaM2: listing.areaM2,
    lotM2: listing.lotM2,
    image: listing.image,
    images: listing.images ?? [listing.image],
    alt: listing.alt,
    description: listing.description,
    features: listing.features,
    lat: listing.lat,
    lng: listing.lng,
    source: "local",
  };
}

export function usePublishedListings(filters: {
  cityId?: string | "all";
  type?: PropertyType | "all";
  operationType?: OperationType | "all";
  budgetMaxUsd?: number | null;
  q?: string;
  sector?: string;
  verifiedOnly?: boolean;
}) {
  const cityId =
    !filters.cityId || filters.cityId === "all" ? undefined : filters.cityId;
  const type =
    !filters.type || filters.type === "all" ? undefined : filters.type;
  const operationType =
    !filters.operationType || filters.operationType === "all"
      ? undefined
      : filters.operationType;

  const convexRows = useQuery(
    api.listings.listPublished,
    BACKEND_CONFIGURED
      ? {
          cityId,
          type,
          operationType,
          budgetMaxUsd: filters.budgetMaxUsd ?? undefined,
          q: filters.q?.trim() || undefined,
          sector: filters.sector?.trim() || undefined,
          verifiedOnly: filters.verifiedOnly || undefined,
        }
      : "skip",
  );

  if (!BACKEND_CONFIGURED) {
    let local = LISTINGS.map(fromLocal);
    if (operationType) {
      local = local.filter((l) => l.operationType === operationType);
    }
    if (cityId) local = local.filter((l) => l.cityId === cityId);
    if (type) local = local.filter((l) => l.type === type);
    if (filters.budgetMaxUsd != null) {
      local = local.filter((l) => l.priceUsd <= filters.budgetMaxUsd!);
    }
    return {
      listings: local,
      loading: false,
      source: "local" as const,
    };
  }

  if (convexRows === undefined) {
    return {
      listings: [] as MusasListingCard[],
      loading: true,
      source: "convex" as const,
    };
  }

  const listings: MusasListingCard[] = convexRows.map((row) => ({
    id: row._id,
    slug: row.slug,
    type: row.type,
    operationType: row.operationType ?? "venta",
    cityId: row.cityId,
    neighborhood: row.neighborhood,
    title: row.title,
    badge: row.badge,
    trustBadge: row.trustBadge,
    contactWhatsapp: row.contactWhatsapp,
    priceUsd: row.priceUsd,
    administrationUsd: row.administrationUsd,
    beds: row.beds,
    baths: row.baths,
    areaM2: row.areaM2,
    lotM2: row.lotM2,
    image: row.images[0] ?? "/villa-dusk.png",
    images: row.images,
    alt: row.alt ?? row.title,
    description: row.description,
    features: row.features,
    lat: row.lat,
    lng: row.lng,
    source: "convex",
  }));

  return { listings, loading: false, source: "convex" as const };
}
