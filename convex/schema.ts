import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const propertyType = v.union(v.literal("apartamentos"), v.literal("casas"));

const listingStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("paused"),
);

const preferentialStatus = v.union(
  v.literal("requested"),
  v.literal("reviewing"),
  v.literal("assigned"),
  v.literal("in_progress"),
  v.literal("done"),
  v.literal("cancelled"),
);

const packageKey = v.union(
  v.literal("fotos"),
  v.literal("legal"),
  v.literal("acompanamiento"),
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    contactPhone: v.optional(v.string()),
    cityId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  listings: defineTable({
    ownerId: v.id("users"),
    status: listingStatus,
    type: propertyType,
    cityId: v.string(),
    neighborhood: v.string(),
    title: v.string(),
    slug: v.string(),
    badge: v.optional(v.string()),
    priceUsd: v.number(),
    administrationUsd: v.number(),
    beds: v.number(),
    baths: v.number(),
    areaM2: v.number(),
    description: v.string(),
    features: v.array(v.string()),
    images: v.array(v.string()),
    alt: v.optional(v.string()),
    isDemo: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_owner", ["ownerId"])
    .index("by_city_status", ["cityId", "status"])
    .index("by_type_status", ["type", "status"]),

  questions: defineTable({
    listingId: v.id("listings"),
    askerId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_listing", ["listingId"])
    .index("by_asker", ["askerId"]),

  answers: defineTable({
    questionId: v.id("questions"),
    sellerId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_question", ["questionId"]),

  favorites: defineTable({
    userId: v.id("users"),
    listingId: v.id("listings"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_listing", ["userId", "listingId"]),

  preferentialRequests: defineTable({
    userId: v.id("users"),
    listingId: v.optional(v.id("listings")),
    packageKeys: v.array(packageKey),
    notes: v.string(),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    status: preferentialStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});
