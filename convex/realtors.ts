import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireUser } from "./lib";
import {
  findActiveRealtorPlan,
  findOpenRealtorRequest,
  listUserRealtorRequests,
  periodLengthMs,
} from "./lib/realtorPlan";

const planKey = v.union(v.literal("plan1"), v.literal("plan2"));

const status = v.union(
  v.literal("requested"),
  v.literal("reviewing"),
  v.literal("payment_submitted"),
  v.literal("payment_approved"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("cancelled"),
);

export const createRequest = mutation({
  args: {
    planKey,
    billingPeriod: v.optional(
      v.union(v.literal("monthly"), v.literal("annual")),
    ),
    notes: v.string(),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    /** One-step intake: include payment ref to skip the second form. */
    paymentReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (args.planKey === "plan2") {
      throw new Error("El Plan 2 aún no está disponible");
    }
    const open = await findOpenRealtorRequest(ctx, user._id);
    if (open) {
      throw new Error(
        "Ya tienes una solicitud en curso. Espera la confirmación de Musas.",
      );
    }
    const active = await findActiveRealtorPlan(ctx, user._id);
    if (active) {
      throw new Error(
        "Ya tienes el Plan Agente activo. Podrás renovar cuando venza el periodo.",
      );
    }
    if (user.accountKind !== "realtor") {
      await ctx.db.patch(user._id, { accountKind: "realtor" });
    }
    const notes = args.notes.trim();
    if (notes.length < 10) {
      throw new Error("Agrega una nota breve (mín. 10 caracteres)");
    }
    const phone = args.contactPhone?.trim();
    if (!phone) {
      throw new Error("Indica un WhatsApp o teléfono");
    }
    const paymentReference = args.paymentReference?.trim();
    if (paymentReference !== undefined && paymentReference.length < 4) {
      throw new Error("Indica la referencia del pago móvil (mín. 4 caracteres)");
    }
    const now = Date.now();
    const withPayment = Boolean(paymentReference);
    if (!user.contactPhone || user.contactPhone !== phone) {
      await ctx.db.patch(user._id, { contactPhone: phone });
    }
    return await ctx.db.insert("realtorSubscriptionRequests", {
      userId: user._id,
      planKey: args.planKey,
      billingPeriod: args.billingPeriod ?? "monthly",
      notes,
      contactPhone: phone,
      contactEmail: args.contactEmail?.trim() || user.email,
      status: withPayment ? "payment_submitted" : "requested",
      ...(withPayment
        ? {
            paymentReference,
            paymentSubmittedAt: now,
          }
        : {}),
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Tras la solicitud: el agente envía la referencia del pago móvil. */
export const submitPaymentReference = mutation({
  args: {
    id: v.id("realtorSubscriptionRequests"),
    paymentReference: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const row = await ctx.db.get(args.id);
    if (!row || row.userId !== user._id) {
      throw new Error("Solicitud no encontrada");
    }
    if (
      row.status !== "requested" &&
      row.status !== "reviewing" &&
      row.status !== "payment_submitted"
    ) {
      throw new Error("Esta solicitud ya no admite referencia de pago");
    }
    const ref = args.paymentReference.trim();
    if (ref.length < 4) {
      throw new Error("Indica la referencia del pago móvil (mín. 4 caracteres)");
    }
    const now = Date.now();
    await ctx.db.patch(args.id, {
      paymentReference: ref,
      paymentSubmittedAt: now,
      status: "payment_submitted",
      updatedAt: now,
    });
    return args.id;
  },
});

/**
 * Admin confirma el pago, activa el plan y marca Realtor Verificado.
 * Crea notificación in-app para el agente.
 */
export const approvePaymentAndActivate = mutation({
  args: {
    id: v.id("realtorSubscriptionRequests"),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Solicitud no encontrada");
    if (row.status !== "payment_submitted" && row.status !== "payment_approved") {
      throw new Error(
        "Solo se puede activar con pago enviado (referencia registrada)",
      );
    }
    const ref = row.paymentReference?.trim();
    if (!ref || ref.length < 4) {
      throw new Error("Falta la referencia de pago móvil");
    }
    const now = Date.now();
    const periodEndsAt = now + periodLengthMs(row.billingPeriod);
    await ctx.db.patch(args.id, {
      status: "approved",
      paymentApprovedAt: now,
      periodEndsAt,
      adminNote: args.adminNote?.trim() || row.adminNote,
      reviewedBy: admin._id,
      updatedAt: now,
    });
    await ctx.db.patch(row.userId, {
      accountKind: "realtor",
      realtorVerified: true,
      realtorVerifiedAt: now,
      realtorVerifiedBy: admin._id,
    });
    const endsLabel = new Date(periodEndsAt).toLocaleDateString("es-VE");
    await ctx.db.insert("notifications", {
      userId: row.userId,
      title: "Plan Agente aprobado",
      body: `Tu pago fue confirmado. Eres Realtor Verificado hasta el ${endsLabel}.`,
      kind: "realtor_approved",
      read: false,
      createdAt: now,
    });
    return args.id;
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
    return await listUserRealtorRequests(ctx, user._id);
  },
});

function withEffectivePeriod<T extends {
  status: string;
  billingPeriod?: "monthly" | "annual";
  paymentApprovedAt?: number;
  periodEndsAt?: number;
  updatedAt: number;
  createdAt: number;
}>(row: T) {
  if (row.status !== "approved") return row;
  if (row.periodEndsAt != null) return row;
  const start = row.paymentApprovedAt ?? row.updatedAt ?? row.createdAt;
  return {
    ...row,
    paymentApprovedAt: row.paymentApprovedAt ?? start,
    periodEndsAt: start + periodLengthMs(row.billingPeriod),
  };
}

/** Resumen del plan para Cuenta: activo / en curso / vencido / sin plan. */
export const myPlanSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;
    const now = Date.now();
    const rawRows = await listUserRealtorRequests(ctx, user._id);
    const needsPeriodBackfill = rawRows.some(
      (r) =>
        r.status === "approved" &&
        (r.periodEndsAt == null || r.paymentApprovedAt == null),
    );
    const rows = rawRows.map(withEffectivePeriod);
    const open = rows.find((r) =>
      ["requested", "reviewing", "payment_submitted", "payment_approved"].includes(
        r.status,
      ),
    );
    const active = rows.find(
      (r) =>
        r.status === "approved" &&
        (r.periodEndsAt == null || r.periodEndsAt > now),
    );
    const latestApproved = rows
      .filter((r) => r.status === "approved")
      .sort(
        (a, b) =>
          (b.paymentApprovedAt ?? b.createdAt) -
          (a.paymentApprovedAt ?? a.createdAt),
      )[0];
    const expired =
      !active &&
      latestApproved &&
      latestApproved.periodEndsAt != null &&
      latestApproved.periodEndsAt <= now
        ? latestApproved
        : null;

    return {
      canCreateRequest: !open && !active,
      openRequest: open ?? null,
      activePlan: active ?? null,
      expiredPlan: expired ?? null,
      needsPeriodBackfill,
      realtorVerified: user.realtorVerified === true,
    };
  },
});

/**
 * Completa periodEndsAt / paymentApprovedAt en planes aprobados legacy
 * (aprobados antes de guardar vencimiento).
 */
export const ensurePeriodEndsAt = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const rows = await listUserRealtorRequests(ctx, user._id);
    let patched = 0;
    for (const row of rows) {
      if (row.status !== "approved") continue;
      if (row.periodEndsAt != null && row.paymentApprovedAt != null) continue;
      const start = row.paymentApprovedAt ?? row.updatedAt ?? row.createdAt;
      await ctx.db.patch(row._id, {
        paymentApprovedAt: row.paymentApprovedAt ?? start,
        periodEndsAt: row.periodEndsAt ?? start + periodLengthMs(row.billingPeriod),
      });
      patched += 1;
    }
    return { patched };
  },
});

/** Admin: backfill global de periodEndsAt en solicitudes aprobadas. */
export const backfillAllPeriodEndsAt = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("realtorSubscriptionRequests").collect();
    let patched = 0;
    for (const row of rows) {
      if (row.status !== "approved") continue;
      if (row.periodEndsAt != null && row.paymentApprovedAt != null) continue;
      const start = row.paymentApprovedAt ?? row.updatedAt ?? row.createdAt;
      await ctx.db.patch(row._id, {
        paymentApprovedAt: row.paymentApprovedAt ?? start,
        periodEndsAt: row.periodEndsAt ?? start + periodLengthMs(row.billingPeriod),
      });
      patched += 1;
    }
    return { patched };
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("realtorSubscriptionRequests").collect();
    return await Promise.all(
      rows.map(async (row) => {
        const user = await ctx.db.get(row.userId);
        return {
          ...row,
          userEmail: user?.email,
          userName: user?.name,
          realtorVerified: user?.realtorVerified === true,
        };
      }),
    );
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("realtorSubscriptionRequests"),
    status,
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(args.id);
    if (!row) throw new Error("Solicitud no encontrada");
    if (args.status === "approved") {
      const ref = row.paymentReference?.trim();
      if (
        row.status !== "payment_submitted" &&
        row.status !== "payment_approved" &&
        row.status !== "approved"
      ) {
        throw new Error(
          "Para aprobar el plan usa «Confirmar pago y activar» con referencia de pago",
        );
      }
      if (!ref || ref.length < 4) {
        throw new Error("Falta la referencia de pago móvil");
      }
    }
    const now = Date.now();
    await ctx.db.patch(args.id, {
      status: args.status,
      adminNote: args.adminNote?.trim() || undefined,
      reviewedBy: admin._id,
      updatedAt: now,
      ...(args.status === "payment_approved"
        ? { paymentApprovedAt: now }
        : {}),
    });
    if (args.status === "approved") {
      const periodEndsAt = now + periodLengthMs(row.billingPeriod);
      await ctx.db.patch(args.id, {
        periodEndsAt,
        paymentApprovedAt: row.paymentApprovedAt ?? now,
      });
      await ctx.db.patch(row.userId, {
        accountKind: "realtor",
        realtorVerified: true,
        realtorVerifiedAt: now,
        realtorVerifiedBy: admin._id,
      });
      await ctx.db.insert("notifications", {
        userId: row.userId,
        title: "Plan Agente aprobado",
        body: "Tu solicitud fue aprobada. Ya eres Realtor Verificado en Musas.",
        kind: "realtor_approved",
        read: false,
        createdAt: now,
      });
    }
    if (args.status === "rejected") {
      await ctx.db.insert("notifications", {
        userId: row.userId,
        title: "Solicitud de agente no aprobada",
        body:
          args.adminNote?.trim() ||
          "Tu solicitud de Plan Agente fue rechazada. Escríbenos si tienes dudas.",
        kind: "general",
        read: false,
        createdAt: now,
      });
    }
    return args.id;
  },
});

export const setVerified = mutation({
  args: {
    userId: v.id("users"),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("Usuario no encontrado");
    if (target.accountKind !== "realtor") {
      throw new Error("Solo se verifica a usuarios Realtor");
    }
    await ctx.db.patch(args.userId, {
      realtorVerified: args.verified,
      realtorVerifiedAt: args.verified ? Date.now() : undefined,
      realtorVerifiedBy: args.verified ? admin._id : undefined,
    });
    return args.userId;
  },
});

export const listRealtorsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("users")
      .withIndex("by_accountKind", (q) => q.eq("accountKind", "realtor"))
      .collect();
    return rows.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      contactPhone: u.contactPhone,
      cityId: u.cityId,
      realtorVerified: u.realtorVerified === true,
      realtorVerifiedAt: u.realtorVerifiedAt,
      createdAt: u.createdAt,
    }));
  },
});
