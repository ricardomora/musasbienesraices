import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireUser } from "./lib";

const packageKey = v.union(
  v.literal("fotos"),
  v.literal("legal"),
  v.literal("acompanamiento"),
);

const status = v.union(
  v.literal("requested"),
  v.literal("reviewing"),
  v.literal("assigned"),
  v.literal("in_progress"),
  v.literal("done"),
  v.literal("cancelled"),
);

export const create = mutation({
  args: {
    listingId: v.optional(v.id("listings")),
    packageKeys: v.array(packageKey),
    notes: v.string(),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (args.packageKeys.length === 0) {
      throw new Error("Elige al menos un paquete");
    }
    const notes = args.notes.trim();
    if (notes.length < 10) {
      throw new Error("Agrega una nota breve (mín. 10 caracteres)");
    }
    if (args.listingId) {
      const listing = await ctx.db.get(args.listingId);
      if (!listing || listing.ownerId !== user._id) {
        throw new Error("Inmueble inválido");
      }
    }
    const now = Date.now();
    return await ctx.db.insert("preferentialRequests", {
      userId: user._id,
      listingId: args.listingId,
      packageKeys: args.packageKeys,
      notes,
      contactPhone: args.contactPhone,
      contactEmail: args.contactEmail ?? user.email,
      status: "requested",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const myRequests = query({
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
      .query("preferentialRequests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("preferentialRequests").collect();
    return await Promise.all(
      rows.map(async (row) => {
        const user = await ctx.db.get(row.userId);
        const listing = row.listingId
          ? await ctx.db.get(row.listingId)
          : null;
        return {
          ...row,
          userEmail: user?.email,
          userName: user?.name,
          listingTitle: listing?.title,
        };
      }),
    );
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("preferentialRequests"),
    status,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});
