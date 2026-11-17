import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const propertyType = v.union(
  v.literal("apartamentos"),
  v.literal("casas"),
  v.literal("locales"),
  v.literal("terrenos"),
  v.literal("galpones"),
  v.literal("oficinas"),
  v.literal("quintas"),
);

/** venta = precio total USD; alquiler = USD / mes. */
const operationType = v.union(v.literal("venta"), v.literal("alquiler"));

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

const accountKind = v.union(v.literal("particular"), v.literal("realtor"));

const realtorPlanKey = v.union(v.literal("plan1"), v.literal("plan2"));

const realtorRequestStatus = v.union(
  v.literal("requested"),
  v.literal("reviewing"), // legacy
  v.literal("payment_submitted"),
  v.literal("payment_approved"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("cancelled"),
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    /** D14: particular vs realtor. Optional until onboarding. */
    accountKind: v.optional(accountKind),
    /** D18: admin-only; never self-serve. ≠ musas_reviewed on listings. */
    realtorVerified: v.optional(v.boolean()),
    realtorVerifiedAt: v.optional(v.number()),
    realtorVerifiedBy: v.optional(v.id("users")),
    contactPhone: v.optional(v.string()),
    cityId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_accountKind", ["accountKind"]),

  listings: defineTable({
    ownerId: v.id("users"),
    status: listingStatus,
    type: propertyType,
    /** Default venta for legacy rows without field. */
    operationType: v.optional(operationType),
    cityId: v.string(),
    neighborhood: v.string(),
    title: v.string(),
    slug: v.string(),
    badge: v.optional(v.string()),
    /** Soft trust: publish first; admin later marks musas_reviewed. */
    trustBadge: v.optional(
      v.union(v.literal("none"), v.literal("musas_reviewed")),
    ),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    contactWhatsapp: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    priceUsd: v.number(),
    /** Condominio / gastos comunes USD / mes (UI: Condominio). */
    administrationUsd: v.number(),
    beds: v.number(),
    baths: v.number(),
    /** m² de construcción (0 en terrenos si solo hay lote). */
    areaM2: v.number(),
    /** m² de terreno — casas, terrenos, quintas, galpones. */
    lotM2: v.optional(v.number()),
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
    .index("by_type_status", ["type", "status"])
    .index("by_operation_status", ["operationType", "status"]),

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

  /** Realtor Plan 1 intake: request → pago móvil → admin confirma → aprobado. */
  realtorSubscriptionRequests: defineTable({
    userId: v.id("users"),
    planKey: realtorPlanKey,
    /** monthly = 15; annual = 15% off. Optional for legacy rows. */
    billingPeriod: v.optional(
      v.union(v.literal("monthly"), v.literal("annual")),
    ),
    notes: v.string(),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    status: realtorRequestStatus,
    /** Referencia del pago móvil enviada por el agente. */
    paymentReference: v.optional(v.string()),
    paymentSubmittedAt: v.optional(v.number()),
    paymentApprovedAt: v.optional(v.number()),
    adminNote: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  /** In-app notices (ej. plan Realtor aprobado). */
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    kind: v.union(
      v.literal("realtor_payment_approved"),
      v.literal("realtor_approved"),
      v.literal("general"),
    ),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  /** Report fake / suspicious listing (Propiedash parity, soft ops). */
  listingReports: defineTable({
    listingId: v.id("listings"),
    reporterId: v.optional(v.id("users")),
    reason: v.string(),
    details: v.optional(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("reviewed"),
      v.literal("dismissed"),
    ),
    createdAt: v.number(),
  })
    .index("by_listing", ["listingId"])
    .index("by_status", ["status"]),
});
