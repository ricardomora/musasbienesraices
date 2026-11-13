import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser, requireAdmin } from "./lib";

const REASONS = [
  "precio_sospechoso",
  "fotos_falsas",
  "no_existe",
  "estafa",
  "otro",
] as const;

export const create = mutation({
  args: {
    listingId: v.id("listings"),
    reason: v.union(
      v.literal("precio_sospechoso"),
      v.literal("fotos_falsas"),
      v.literal("no_existe"),
      v.literal("estafa"),
      v.literal("otro"),
    ),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.status !== "published") {
      throw new Error("Inmueble no disponible");
    }
    const user = await getAuthenticatedUser(ctx);
    const details = args.details?.trim().slice(0, 500);
    return await ctx.db.insert("listingReports", {
      listingId: args.listingId,
      reporterId: user?._id,
      reason: args.reason,
      details: details || undefined,
      status: "open",
      createdAt: Date.now(),
    });
  },
});

export const listOpenAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const open = await ctx.db
      .query("listingReports")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    const enriched = await Promise.all(
      open
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (r) => {
          const listing = await ctx.db.get(r.listingId);
          return {
            ...r,
            listingTitle: listing?.title ?? "—",
            listingSlug: listing?.slug,
            listingStatus: listing?.status,
          };
        }),
    );
    return enriched;
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("listingReports"),
    status: v.union(
      v.literal("open"),
      v.literal("reviewed"),
      v.literal("dismissed"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});

// Keep reason union in sync with create args (type-only aid for reviewers).
void REASONS;
