import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib";

export const myNotifications = query({
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
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt).slice(0, 30);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return 0;
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return rows.filter((n) => !n.read).length;
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(args.id);
    if (!row || row.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.id, { read: true });
    return args.id;
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const row of rows) {
      if (!row.read) await ctx.db.patch(row._id, { read: true });
    }
    return rows.length;
  },
});
