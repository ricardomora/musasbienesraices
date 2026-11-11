export type PreferentialPackageKey = "fotos" | "legal" | "acompanamiento";

export type PreferentialStatus =
  | "requested"
  | "reviewing"
  | "assigned"
  | "in_progress"
  | "done"
  | "cancelled";

export const PREFERENTIAL_PACKAGES: {
  key: PreferentialPackageKey;
  name: string;
  includes: string;
  fromUsd: number;
}[] = [
  {
    key: "fotos",
    name: "Sesión fotográfica",
    includes:
      "Sesión en sitio, selección editada y carga a tu ficha de venta Musas.",
    fromUsd: 120,
  },
  {
    key: "legal",
    name: "Asesoría legal",
    includes:
      "Revisión documental básica y checklist para un cierre de venta más claro.",
    fromUsd: 200,
  },
  {
    key: "acompanamiento",
    name: "Acompañamiento",
    includes:
      "Coordinación de visitas de compradores y soporte en la negociación.",
    fromUsd: 150,
  },
];

export const PREFERENTIAL_STATUS_LABELS: Record<PreferentialStatus, string> = {
  requested: "Solicitada",
  reviewing: "En revisión",
  assigned: "Asignada",
  in_progress: "En curso",
  done: "Completada",
  cancelled: "Cancelada",
};

export function packageName(key: string): string {
  return (
    PREFERENTIAL_PACKAGES.find((p) => p.key === key)?.name ?? key
  );
}

export function preferentialStatusLabel(status: string): string {
  return (
    PREFERENTIAL_STATUS_LABELS[status as PreferentialStatus] ?? status
  );
}
