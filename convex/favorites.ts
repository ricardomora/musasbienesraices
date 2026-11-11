import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    const rows = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return rows.map((r) => r.listingId);
  },
});

export const toggle = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", user._id).eq("listingId", args.listingId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.status !== "published") {
      throw new Error("Inmueble no disponible");
    }

    await ctx.db.insert("favorites", {
      userId: user._id,
      listingId: args.listingId,
      createdAt: Date.now(),
    });
    return { liked: true };
  },
});

export const mergeLocal = mutation({
  args: { listingIds: v.array(v.id("listings")) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    for (const listingId of args.listingIds) {
      const listing = await ctx.db.get(listingId);
      if (!listing || listing.status !== "published") continue;
      const existing = await ctx.db
        .query("favorites")
        .withIndex("by_user_listing", (q) =>
          q.eq("userId", user._id).eq("listingId", listingId),
        )
        .unique();
      if (!existing) {
        await ctx.db.insert("favorites", {
          userId: user._id,
          listingId,
          createdAt: Date.now(),
        });
      }
    }
    return true;
  },
});
