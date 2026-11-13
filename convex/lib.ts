import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthenticatedUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export async function uniqueListingSlug(
  ctx: MutationCtx,
  base: string,
  excludeId?: Id<"listings">,
) {
  let slug = slugify(base) || "inmueble";
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const existing = await ctx.db
      .query("listings")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .unique();
    if (!existing || (excludeId && existing._id === excludeId)) {
      return candidate;
    }
    n += 1;
  }
}

export function listingIsComplete(listing: {
  title: string;
  neighborhood: string;
  description: string;
  priceUsd: number;
  administrationUsd: number;
  beds: number;
  baths: number;
  areaM2: number;
  images: string[];
  cityId: string;
  lat?: number;
  lng?: number;
}) {
  const hasPin =
    typeof listing.lat === "number" &&
    typeof listing.lng === "number" &&
    Number.isFinite(listing.lat) &&
    Number.isFinite(listing.lng);
  return (
    listing.title.trim().length >= 3 &&
    listing.neighborhood.trim().length >= 2 &&
    listing.description.trim().length >= 40 &&
    listing.priceUsd > 0 &&
    listing.administrationUsd >= 0 &&
    listing.beds >= 0 &&
    listing.baths >= 0 &&
    listing.areaM2 > 0 &&
    listing.images.length >= 1 &&
    listing.cityId.trim().length > 0 &&
    hasPin
  );
}

export type PublicListing = Doc<"listings">;
