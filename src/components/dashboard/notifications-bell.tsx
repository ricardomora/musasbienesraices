"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Bell, MessageCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { cn } from "@/lib/utils";

export function NotificationsBell() {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const notifUnread = useQuery(
    api.notifications.unreadCount,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const inboxBundle = useQuery(
    api.questions.inboxUnreadBundle,
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

  const avisosCount = notifUnread ?? 0;
  const mensajesCount = inboxBundle?.count ?? 0;
  const count = avisosCount + mensajesCount;
  const avisos = (rows ?? []).slice(0, 4);
  const mensajes = open ? (inboxBundle?.preview ?? []) : [];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={
          count > 0
            ? `Avisos y mensajes, ${count} pendientes`
            : "Avisos y mensajes"
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
          aria-label="Panel de avisos y mensajes"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              Avisos y mensajes
            </p>
            {count > 0 ? (
              <span className="text-xs text-neon">{count} pendientes</span>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            <div className="border-b border-border px-4 py-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Mensajes
                {mensajesCount > 0 ? ` · ${mensajesCount}` : ""}
              </p>
            </div>
            <ul>
              {mensajes.map((t) => (
                <li key={t.question._id}>
                  <Link
                    href="/dashboard/mensajes"
                    onClick={() => setOpen(false)}
                    className="block border-b border-border bg-neon/5 px-4 py-3 text-sm transition hover:bg-neon/10"
                  >
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      <MessageCircle className="size-3.5 text-neon" aria-hidden />
                      {t.askerName}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {t.question.body}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {t.listingTitle} ·{" "}
                      {new Date(t.question.createdAt).toLocaleString("es-VE")}
                    </p>
                  </Link>
                </li>
              ))}
              {inboxBundle && mensajes.length === 0 ? (
                <li className="border-b border-border px-4 py-4 text-sm text-muted-foreground">
                  Sin preguntas pendientes.
                </li>
              ) : null}
              {inboxBundle === undefined ? (
                <li className="border-b border-border px-4 py-4 text-sm text-muted-foreground">
                  Cargando mensajes…
                </li>
              ) : null}
            </ul>

            <div className="border-b border-border px-4 py-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Avisos
                {avisosCount > 0 ? ` · ${avisosCount}` : ""}
              </p>
            </div>
            <ul>
              {avisos.map((n) => (
                <li
                  key={n._id}
                  className={cn(
                    "border-b border-border px-4 py-3 text-sm last:border-b-0",
                    !n.read && "bg-neon/5",
                  )}
                >
                  <Link
                    href="/dashboard/notificaciones"
                    onClick={() => {
                      if (!n.read) void markRead({ id: n._id });
                      setOpen(false);
                    }}
                    className="block"
                  >
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString("es-VE")}
                    </p>
                  </Link>
                  {!n.read ? (
                    <button
                      type="button"
                      className="mt-1 text-[11px] text-neon hover:underline"
                      onClick={() => void markRead({ id: n._id })}
                    >
                      Marcar leída
                    </button>
                  ) : null}
                </li>
              ))}
              {rows?.length === 0 ? (
                <li className="px-4 py-4 text-sm text-muted-foreground">
                  Sin avisos aún.
                </li>
              ) : null}
              {rows === undefined ? (
                <li className="px-4 py-4 text-sm text-muted-foreground">
                  Cargando avisos…
                </li>
              ) : null}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-border p-2">
            <Link
              href="/dashboard/mensajes"
              onClick={() => setOpen(false)}
              className="interactive-surface flex h-10 items-center justify-center rounded-xl text-sm font-medium text-neon hover:bg-neon/10"
            >
              Mensajes
            </Link>
            <Link
              href="/dashboard/notificaciones"
              onClick={() => setOpen(false)}
              className="interactive-surface flex h-10 items-center justify-center rounded-xl text-sm font-medium text-neon hover:bg-neon/10"
            >
              Avisos
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
