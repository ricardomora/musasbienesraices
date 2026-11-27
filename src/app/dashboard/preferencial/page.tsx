import { redirect } from "next/navigation";

/** Preferencial vive por ficha: historial en Mis inmuebles. */
export default function DashboardPreferencialRedirect() {
  redirect("/dashboard/inmuebles#solicitudes-preferencial");
}
