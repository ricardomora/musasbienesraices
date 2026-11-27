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
      "Vamos al inmueble, editamos la selección y las subimos a tu ficha.",
    fromUsd: 120,
  },
  {
    key: "legal",
    name: "Revisión legal",
    includes:
      "Revisamos documentos básicos y te dejamos el checklist de cierre.",
    fromUsd: 200,
  },
  {
    key: "acompanamiento",
    name: "Acompañamiento",
    includes:
      "Coordinamos visitas de compradores y te respaldamos en la negociación.",
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

/** Solicitud abierta (aún no completada ni cancelada). */
export function isPreferentialActive(status: string): boolean {
  return status !== "done" && status !== "cancelled";
}

export function preferentialHref(listingId?: string, paquete?: PreferentialPackageKey) {
  const params = new URLSearchParams();
  if (listingId) params.set("listingId", listingId);
  if (paquete) params.set("paquete", paquete);
  const q = params.toString();
  return q ? `/preferencial?${q}` : "/preferencial";
}
