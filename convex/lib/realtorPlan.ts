import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

type Ctx = QueryCtx | MutationCtx;

const OPEN_STATUSES = new Set([
  "requested",
  "reviewing",
  "payment_submitted",
  "payment_approved",
]);

export function periodLengthMs(
  billingPeriod: "monthly" | "annual" | undefined,
): number {
  return billingPeriod === "annual" ? 365 * DAY_MS : 30 * DAY_MS;
}

export function isApprovedPlanActive(
  row: Doc<"realtorSubscriptionRequests">,
  now = Date.now(),
): boolean {
  if (row.status !== "approved") return false;
  if (row.periodEndsAt == null) return true;
  return row.periodEndsAt > now;
}

export async function listUserRealtorRequests(
  ctx: Ctx,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("realtorSubscriptionRequests")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
}

export async function findOpenRealtorRequest(
  ctx: Ctx,
  userId: Id<"users">,
) {
  const rows = await listUserRealtorRequests(ctx, userId);
  return rows.find((r) => OPEN_STATUSES.has(r.status)) ?? null;
}

export async function findActiveRealtorPlan(
  ctx: Ctx,
  userId: Id<"users">,
  now = Date.now(),
) {
  const rows = await listUserRealtorRequests(ctx, userId);
  return rows.find((r) => isApprovedPlanActive(r, now)) ?? null;
}

/** Verified badge on fichas only while Plan Agente period is active. */
export async function isRealtorPlanActiveForUser(
  ctx: Ctx,
  userId: Id<"users">,
  realtorVerified: boolean | undefined,
  now = Date.now(),
): Promise<boolean> {
  if (!realtorVerified) return false;
  const active = await findActiveRealtorPlan(ctx, userId, now);
  return active != null;
}
