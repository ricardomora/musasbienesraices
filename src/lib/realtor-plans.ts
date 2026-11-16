export type RealtorPlanKey = "plan1" | "plan2";

export type RealtorBillingPeriod = "monthly" | "annual";

export type RealtorRequestStatus =
  | "requested"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled";

/** Plan agente: 15 / mes; anual con 15% dto. */
export const REALTOR_MONTHLY_PRICE = 15;
export const REALTOR_ANNUAL_DISCOUNT = 0.15;
export const REALTOR_ANNUAL_PRICE = Math.round(
  REALTOR_MONTHLY_PRICE * 12 * (1 - REALTOR_ANNUAL_DISCOUNT),
);

export const REALTOR_PLAN_BENEFITS = [
  "Acceso completo a la plataforma Musas",
  "Insignia de agente verificado (tras revisión)",
  "Anuncios publicados de inmediato, sin cola de aprobación",
  "Publica propiedades y gestiona consultas en un solo lugar",
  "Conecta con compradores e inquilinos interesados",
  "Adiestramiento calificado y cursos para tu equipo",
] as const;

export const REALTOR_PLANS: {
  key: RealtorPlanKey;
  name: string;
  available: boolean;
  includes: string[];
  monthlyPrice?: number;
}[] = [
  {
    key: "plan1",
    name: "Plan Agente Musas",
    available: true,
    includes: [...REALTOR_PLAN_BENEFITS],
    monthlyPrice: REALTOR_MONTHLY_PRICE,
  },
  {
    key: "plan2",
    name: "Plan 2",
    available: false,
    includes: ["Beneficios adicionales — por definir"],
  },
];

export const REALTOR_STATUS_LABELS: Record<RealtorRequestStatus, string> = {
  requested: "Solicitada",
  reviewing: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
};

export const REALTOR_EDU_URL =
  process.env.NEXT_PUBLIC_REALTOR_EDU_URL?.trim() ||
  "https://www.musasbienesraices.com/ayuda";

export function realtorPlanName(key: string): string {
  return REALTOR_PLANS.find((p) => p.key === key)?.name ?? key;
}

export function realtorStatusLabel(status: string): string {
  return REALTOR_STATUS_LABELS[status as RealtorRequestStatus] ?? status;
}

export function realtorBillingLabel(period: string | undefined): string {
  if (period === "annual") {
    return `Anual · ${REALTOR_ANNUAL_PRICE}/año (−15%)`;
  }
  return `Mensual · ${REALTOR_MONTHLY_PRICE}/mes`;
}
