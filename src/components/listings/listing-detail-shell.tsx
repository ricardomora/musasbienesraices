"use client";

import { BACKEND_CONFIGURED } from "@/lib/backend";
import { LocalListingDetail } from "./local-listing-detail";
import { ConvexListingDetail } from "./convex-listing-detail";

export function ListingDetailShell({ slug }: { slug: string }) {
  if (BACKEND_CONFIGURED) return <ConvexListingDetail slug={slug} />;
  return <LocalListingDetail slug={slug} />;
}
