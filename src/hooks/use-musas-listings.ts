"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { OperationType, PropertyType } from "@/data/listings";
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
  contactInstagram?: string;
  ownerName?: string;
  ownerAvatarUrl?: string;
  ownerRealtorVerified?: boolean;
  ownerContactPhone?: string;
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

/**
 * Published listings for explore/home/map.
 * Prod path is Convex-only (decision A: no offline LISTINGS fallback).
 */
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
    return {
      listings: [] as MusasListingCard[],
      loading: false,
      source: "convex" as const,
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
    contactInstagram: row.contactInstagram,
    ownerName: row.ownerName,
    ownerAvatarUrl: row.ownerAvatarUrl,
    ownerRealtorVerified: row.ownerRealtorVerified,
    ownerContactPhone: row.ownerContactPhone,
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
