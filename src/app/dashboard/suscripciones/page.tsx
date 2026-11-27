import { redirect } from "next/navigation";

/** Suscripciones vive dentro de /dashboard/cuenta. */
export default function DashboardSuscripcionesPage() {
  redirect("/dashboard/cuenta#plan-agente");
}
