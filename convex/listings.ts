import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  listingIsComplete,
  requireAdmin,
  requireUser,
  uniqueListingSlug,
} from "./lib";

const propertyType = v.union(v.literal("apartamentos"), v.literal("casas"));
const operationType = v.union(v.literal("venta"), v.literal("alquiler"));

function listingOperation(
  l: { operationType?: "venta" | "alquiler" },
): "venta" | "alquiler" {
  return l.operationType ?? "venta";
}

export const listPublished = query({
  args: {
    cityId: v.optional(v.string()),
    type: v.optional(propertyType),
    operationType: v.optional(operationType),
    budgetMaxUsd: v.optional(v.number()),
    q: v.optional(v.string()),
    sector: v.optional(v.string()),
    verifiedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    if (args.cityId && args.cityId !== "all") {
      items = items.filter((l) => l.cityId === args.cityId);
    }
    if (args.type) {
      items = items.filter((l) => l.type === args.type);
    }
    if (args.operationType) {
      items = items.filter(
        (l) => listingOperation(l) === args.operationType,
      );
    }
    if (args.budgetMaxUsd != null) {
      items = items.filter((l) => l.priceUsd <= args.budgetMaxUsd!);
    }
    if (args.verifiedOnly) {
      items = items.filter((l) => l.trustBadge === "musas_reviewed");
    }
    if (args.sector?.trim()) {
      const s = args.sector.trim().toLowerCase();
      items = items.filter((l) =>
        l.neighborhood.toLowerCase().includes(s),
      );
    }
    if (args.q?.trim()) {
      const q = args.q.trim().toLowerCase();
      items = items.filter((l) => {
        const hay = `${l.title} ${l.neighborhood} ${l.description} ${l.cityId}`.toLowerCase();
        return hay.includes(q);
      });
    }

    return items.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const listing = await ctx.db
      .query("listings")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!listing) return null;

    const identity = await ctx.auth.getUserIdentity();
    let isOwner = false;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();
      isOwner = !!user && user._id === listing.ownerId;
    }

    if (listing.status !== "published" && !isOwner) {
      return null;
    }

    const owner = await ctx.db.get(listing.ownerId);
    return {
      ...listing,
      ownerName: owner?.name ?? "Vendedor Musas",
      ownerAccountKind: owner?.accountKind ?? null,
      ownerRealtorVerified: owner?.realtorVerified === true,
      isOwner,
    };
  },
});

export const myListings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return await ctx.db
      .query("listings")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const getMine = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;
    const listing = await ctx.db.get(args.id);
    if (!listing || listing.ownerId !== user._id) return null;
    return listing;
  },
});

export const createDraft = mutation({
  args: {
    type: propertyType,
    operationType: v.optional(operationType),
    cityId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const now = Date.now();
    const slug = await uniqueListingSlug(ctx, args.title);
    return await ctx.db.insert("listings", {
      ownerId: user._id,
      status: "draft",
      type: args.type,
      operationType: args.operationType ?? "venta",
      cityId: args.cityId,
      neighborhood: "",
      title: args.title.trim(),
      slug,
      priceUsd: 0,
      administrationUsd: 0,
      beds: 0,
      baths: 0,
      areaM2: 0,
      description: "",
      features: [],
      images: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateListing = mutation({
  args: {
    id: v.id("listings"),
    type: v.optional(propertyType),
    operationType: v.optional(operationType),
    cityId: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    title: v.optional(v.string()),
    badge: v.optional(v.string()),
    priceUsd: v.optional(v.number()),
    administrationUsd: v.optional(v.number()),
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    areaM2: v.optional(v.number()),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    alt: v.optional(v.string()),
    contactWhatsapp: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing || listing.ownerId !== user._id) {
      throw new Error("Forbidden");
    }

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    const fields = [
      "type",
      "operationType",
      "cityId",
      "neighborhood",
      "title",
      "badge",
      "priceUsd",
      "administrationUsd",
      "beds",
      "baths",
      "areaM2",
      "description",
      "features",
      "images",
      "alt",
      "contactWhatsapp",
      "lat",
      "lng",
    ] as const;

    for (const key of fields) {
      if (args[key] !== undefined) patch[key] = args[key];
    }

    if (typeof args.title === "string" && args.title.trim() !== listing.title) {
      patch.slug = await uniqueListingSlug(ctx, args.title, listing._id);
    }

    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});

export const publishListing = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing || listing.ownerId !== user._id) {
      throw new Error("Forbidden");
    }
    if (!listingIsComplete(listing)) {
      throw new Error(
        "Completa fotos, pin en el mapa, precio, administración y descripción (mín. 40 caracteres) antes de publicar.",
      );
    }
    await ctx.db.patch(args.id, {
      status: "published",
      // Soft trust: visible now; admin can later mark musas_reviewed.
      trustBadge: listing.trustBadge ?? "none",
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const setTrustBadge = mutation({
  args: {
    id: v.id("listings"),
    trustBadge: v.union(v.literal("none"), v.literal("musas_reviewed")),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Not found");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      trustBadge: args.trustBadge,
      reviewedAt: args.trustBadge === "musas_reviewed" ? now : undefined,
      reviewedBy: args.trustBadge === "musas_reviewed" ? admin._id : undefined,
      updatedAt: now,
    });
    return args.id;
  },
});

export const setListingStatus = mutation({
  args: {
    id: v.id("listings"),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("paused")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Not found");

    const isOwner = listing.ownerId === user._id;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) throw new Error("Forbidden");

    if (args.status === "published" && isOwner && !listingIsComplete(listing)) {
      throw new Error("Ficha incompleta");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const listAllAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("listings").collect();
  },
});
