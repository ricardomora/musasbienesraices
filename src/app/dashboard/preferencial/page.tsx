import { redirect } from "next/navigation";

/** Preferencial vive por ficha en Editar inmueble. */
export default function DashboardPreferencialRedirect() {
  redirect("/dashboard/inmuebles");
}
