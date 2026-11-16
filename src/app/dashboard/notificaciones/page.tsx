"use client";

import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

function NotificationsPanel() {
  const rows = useQuery(api.notifications.myNotifications);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Avisos de Musas (aprobación de plan, pagos, etc.).
          </p>
        </div>
        {(rows?.some((n) => !n.read) ?? false) ? (
          <button
            type="button"
            className="text-sm text-neon hover:underline"
            onClick={() =>
              void markAllRead({}).then(() => toast.success("Todo leído"))
            }
          >
            Marcar todo leído
          </button>
        ) : null}
      </div>

      <ul className="mt-8 space-y-3">
        {(rows ?? []).map((n) => (
          <li
            key={n._id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              n.read
                ? "border-border text-muted-foreground"
                : "border-neon/35 bg-neon/5 text-foreground"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{n.title}</p>
                <p className="mt-1 text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString("es-VE")}
                </p>
              </div>
              {!n.read ? (
                <button
                  type="button"
                  className="text-xs text-neon hover:underline"
                  onClick={() => void markRead({ id: n._id })}
                >
                  Marcar leída
                </button>
              ) : null}
            </div>
          </li>
        ))}
        {rows?.length === 0 ? (
          <p className="text-muted-foreground">Sin notificaciones aún.</p>
        ) : null}
      </ul>
    </div>
  );
}

export default function DashboardNotificacionesPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="notificaciones">
        <DashboardNav />
        <NotificationsPanel />
      </BackendGate>
    </main>
  );
}
