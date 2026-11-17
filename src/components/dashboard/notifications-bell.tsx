"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Bell } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { cn } from "@/lib/utils";

export function NotificationsBell() {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unread = useQuery(
    api.notifications.unreadCount,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const rows = useQuery(
    api.notifications.myNotifications,
    BACKEND_CONFIGURED && isSignedIn && open ? {} : "skip",
  );
  const markRead = useMutation(api.notifications.markRead);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const count = unread ?? 0;
  const preview = (rows ?? []).slice(0, 5);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={
          count > 0
            ? `Notificaciones, ${count} sin leer`
            : "Notificaciones"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-neon/40 hover:text-neon",
          open && "border-neon/40 text-neon",
        )}
      >
        <Bell className="size-4" aria-hidden />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-neon px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Panel de notificaciones"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Avisos</p>
            {count > 0 ? (
              <span className="text-xs text-neon">{count} sin leer</span>
            ) : null}
          </div>

          <ul className="max-h-72 overflow-y-auto">
            {preview.map((n) => (
              <li
                key={n._id}
                className={cn(
                  "border-b border-border px-4 py-3 text-sm last:border-b-0",
                  !n.read && "bg-neon/5",
                )}
              >
                <p className="font-medium text-foreground">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {n.body}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("es-VE")}
                  </span>
                  {!n.read ? (
                    <button
                      type="button"
                      className="text-[11px] text-neon hover:underline"
                      onClick={() => void markRead({ id: n._id })}
                    >
                      Marcar leída
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
            {rows?.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                Sin notificaciones aún.
              </li>
            ) : null}
            {rows === undefined ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                Cargando…
              </li>
            ) : null}
          </ul>

          <div className="border-t border-border p-2">
            <Link
              href="/dashboard/notificaciones"
              onClick={() => setOpen(false)}
              className="interactive-surface flex h-10 items-center justify-center rounded-xl text-sm font-medium text-neon hover:bg-neon/10"
            >
              Ver más
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
