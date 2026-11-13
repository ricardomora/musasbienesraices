export const REPORT_REASONS = [
  { id: "precio_sospechoso", label: "Precio sospechoso" },
  { id: "fotos_falsas", label: "Fotos que no cuadran" },
  { id: "no_existe", label: "El inmueble no existe" },
  { id: "estafa", label: "Posible estafa" },
  { id: "otro", label: "Otro" },
] as const;

export type ReportReasonId = (typeof REPORT_REASONS)[number]["id"];
