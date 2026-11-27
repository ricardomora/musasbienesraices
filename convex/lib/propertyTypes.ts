import { v } from "convex/values";

/** Single source for listing type validators (keep in sync with src/lib/property-types.ts). */
export const propertyType = v.union(
  v.literal("apartamentos"),
  v.literal("casas"),
  v.literal("locales"),
  v.literal("terrenos"),
  v.literal("galpones"),
  v.literal("oficinas"),
  v.literal("quintas"),
  v.literal("fondos_comercio"),
);

export const operationType = v.union(
  v.literal("venta"),
  v.literal("alquiler"),
);
