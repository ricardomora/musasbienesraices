/** Tipos de inmueble Musas (VE). */

export const PROPERTY_TYPES = [
  "apartamentos",
  "casas",
  "locales",
  "terrenos",
  "galpones",
  "oficinas",
  "quintas",
  "fondos_comercio",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartamentos: "Apartamento",
  casas: "Casa",
  locales: "Local comercial",
  terrenos: "Terreno",
  galpones: "Galpón",
  oficinas: "Oficina",
  quintas: "Quinta",
  fondos_comercio: "Fondo de Comercio",
};

export const PROPERTY_TYPE_PLURAL: Record<PropertyType, string> = {
  apartamentos: "Apartamentos",
  casas: "Casas",
  locales: "Locales",
  terrenos: "Terrenos",
  galpones: "Galpones",
  oficinas: "Oficinas",
  quintas: "Quintas",
  fondos_comercio: "Fondos de Comercio",
};

export function isPropertyType(value: string): value is PropertyType {
  return (PROPERTY_TYPES as readonly string[]).includes(value);
}

/** Tipos donde aplica m² de terreno. */
export function showsLotM2(type: PropertyType): boolean {
  return (
    type === "casas" ||
    type === "terrenos" ||
    type === "quintas" ||
    type === "galpones"
  );
}

/** Tipos donde m² de construcción es el área principal. */
export function showsConstructionM2(type: PropertyType): boolean {
  return type !== "terrenos";
}

/** Habitaciones/baños no aplican a terreno. */
export function showsBedsBaths(type: PropertyType): boolean {
  return (
    type !== "terrenos" &&
    type !== "locales" &&
    type !== "galpones" &&
    type !== "fondos_comercio"
  );
}
