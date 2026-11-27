import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { requireUser } from "./lib";

export const listForListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) return [];

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
      return [];
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();

    const enriched = await Promise.all(
      questions.map(async (q) => {
        const asker = await ctx.db.get(q.askerId);
        const answer = await ctx.db
          .query("answers")
          .withIndex("by_question", (a) => a.eq("questionId", q._id))
          .unique();
        return {
          ...q,
          askerName: asker?.name ?? "Comprador",
          answer: answer
            ? {
                ...answer,
              }
            : null,
        };
      }),
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const ask = mutation({
  args: {
    listingId: v.id("listings"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.status !== "published") {
      throw new Error("Inmueble no disponible");
    }
    if (listing.ownerId === user._id) {
      throw new Error("No puedes preguntar en tu propio inmueble");
    }
    const body = args.body.trim();
    if (body.length < 10) throw new Error("Escribe una pregunta más completa");
    if (body.length > 1000) throw new Error("Pregunta demasiado larga");

    return await ctx.db.insert("questions", {
      listingId: args.listingId,
      askerId: user._id,
      body,
      createdAt: Date.now(),
    });
  },
});

export const answer = mutation({
  args: {
    questionId: v.id("questions"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Pregunta no encontrada");
    const listing = await ctx.db.get(question.listingId);
    if (!listing || listing.ownerId !== user._id) {
      throw new Error("Forbidden");
    }
    const body = args.body.trim();
    if (body.length < 5) throw new Error("Respuesta muy corta");

    const existing = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { body });
      return existing._id;
    }

    return await ctx.db.insert("answers", {
      questionId: args.questionId,
      sellerId: user._id,
      body,
      createdAt: Date.now(),
    });
  },
});

async function sellerInboxThreads(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return [];
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) return [];
  const myListings = await ctx.db
    .query("listings")
    .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
    .collect();

  const threads = [];
  for (const listing of myListings) {
    const qs = await ctx.db
      .query("questions")
      .withIndex("by_listing", (q) => q.eq("listingId", listing._id))
      .collect();
    for (const q of qs) {
      const answer = await ctx.db
        .query("answers")
        .withIndex("by_question", (a) => a.eq("questionId", q._id))
        .unique();
      const asker = await ctx.db.get(q.askerId);
      threads.push({
        question: q,
        answer,
        listingTitle: listing.title,
        listingSlug: listing.slug,
        askerName: asker?.name ?? "Comprador",
        unanswered: !answer,
      });
    }
  }

  return threads.sort(
    (a, b) => b.question.createdAt - a.question.createdAt,
  );
}

export const inboxForSeller = query({
  args: {},
  handler: async (ctx) => {
    return await sellerInboxThreads(ctx);
  },
});

/** Una sola lectura: count + preview (campana). */
export const inboxUnreadBundle = query({
  args: {},
  handler: async (ctx) => {
    const unanswered = (await sellerInboxThreads(ctx)).filter(
      (t) => t.unanswered,
    );
    return {
      count: unanswered.length,
      preview: unanswered.slice(0, 5),
    };
  },
});

/** @deprecated Prefer inboxUnreadBundle */
export const inboxUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const threads = await sellerInboxThreads(ctx);
    return threads.filter((t) => t.unanswered).length;
  },
});

/** @deprecated Prefer inboxUnreadBundle */
export const inboxUnreadPreview = query({
  args: {},
  handler: async (ctx) => {
    const threads = await sellerInboxThreads(ctx);
    return threads.filter((t) => t.unanswered).slice(0, 5);
  },
});
