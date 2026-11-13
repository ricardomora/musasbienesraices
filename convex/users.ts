import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser, requireAdmin, requireUser } from "./lib";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function resolveRole(email: string): "user" | "admin" {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
}

export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    /** Must match Convex env USER_SYNC_SECRET (same value in Next .env.local). */
    syncSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const expected = process.env.USER_SYNC_SECRET;
    if (!expected || args.syncSecret !== expected) {
      throw new Error("Forbidden");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const role = resolveRole(args.email);

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name ?? existing.name,
        avatarUrl: args.avatarUrl ?? existing.avatarUrl,
        role: existing.role === "admin" ? "admin" : role,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role,
      createdAt: Date.now(),
    });
  },
});

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const jwtEmail = identity.email?.trim().toLowerCase() || "";
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    // Prefer JWT email; if missing (common when Clerk JWT template omits it),
    // keep webhook/synced email — never overwrite with a fake @users.clerk.local.
    const email =
      jwtEmail ||
      existing?.email?.trim().toLowerCase() ||
      `${identity.subject.replace(/[^a-zA-Z0-9]/g, "")}@users.clerk.local`;
    const role = resolveRole(email);

    if (existing) {
      const nextName = identity.name?.trim() || existing.name;
      const nextAvatar = identity.pictureUrl?.trim() || existing.avatarUrl;
      if (
        existing.role !== role ||
        existing.email !== email ||
        existing.name !== nextName ||
        existing.avatarUrl !== nextAvatar
      ) {
        await ctx.db.patch(existing._id, {
          email,
          name: nextName,
          avatarUrl: nextAvatar,
          role,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email,
      name: identity.name?.trim() || undefined,
      avatarUrl: identity.pictureUrl?.trim() || undefined,
      role,
      createdAt: Date.now(),
    });
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => getAuthenticatedUser(ctx),
});

export const updateProfile = mutation({
  args: {
    contactPhone: v.optional(v.string()),
    cityId: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.patch(user._id, {
      contactPhone: args.contactPhone ?? user.contactPhone,
      cityId: args.cityId ?? user.cityId,
      name: args.name ?? user.name,
    });
    return user._id;
  },
});

export const listUsersAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").collect();
  },
});
