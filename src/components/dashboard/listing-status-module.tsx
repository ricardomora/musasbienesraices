"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { formatUsd } from "@/data/listings";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  paused: "Pausado",
  sold: "Vendida / alquilada",
};

function defaultNext(status: string): "paused" | "sold" | "published" {
  if (status === "published") return "paused";
  return "published";
}

type ListingStatusModuleProps = {
  listingId: Id<"listings">;
  status: string;
  operationType?: "venta" | "alquiler";
  statusReason?: string;
  soldPriceUsd?: number;
};

export function ListingStatusModule({
  listingId,
  status,
  operationType = "venta",
  statusReason,
  soldPriceUsd,
}: ListingStatusModuleProps) {
  const setStatus = useMutation(api.listings.setListingStatus);
  const [next, setNext] = useState<"paused" | "sold" | "published">(() =>
    defaultNext(status),
  );
  const [reason, setReason] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNext(defaultNext(status));
  }, [status]);

  const closedLabel =
    operationType === "alquiler" ? "Marcar como alquilada" : "Marcar como vendida";
  const priceLabel =
    operationType === "alquiler"
      ? "Monto de cierre (USD/mes)"
      : "Monto de venta (USD)";

  async function submit() {
    setBusy(true);
    try {
      if (next === "published") {
        await setStatus({ id: listingId, status: "published" });
        toast.success("Publicación reactivada");
      } else if (next === "paused") {
        await setStatus({
          id: listingId,
          status: "paused",
          reason,
        });
        toast.success("Publicación pausada");
      } else {
        await setStatus({
          id: listingId,
          status: "sold",
          reason,
          soldPriceUsd: Number(price),
        });
        toast.success(
          operationType === "alquiler"
            ? "Marcada como alquilada"
            : "Marcada como vendida",
        );
      }
      setReason("");
      setPrice("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside
      className="rounded-2xl border border-border bg-muted/20 p-5"
      aria-labelledby="listing-status-title"
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        Estado
      </p>
      <h2
        id="listing-status-title"
        className="mt-1 text-lg font-semibold text-foreground"
      >
        Actualizar publicación
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pausar u ocultar del explorador, o marcar el cierre. El motivo es
        obligatorio.
      </p>

      <p className="mt-3 text-sm text-foreground">
        Ahora:{" "}
        <span
          className={cn(
            "font-medium",
            status === "published" && "text-neon",
            status === "paused" && "text-amber-500",
            status === "sold" && "text-emerald-500",
          )}
        >
          {STATUS_LABEL[status] ?? status}
        </span>
        {status === "sold" && soldPriceUsd ? (
          <span className="text-muted-foreground">
            {" "}
            · {formatUsd(soldPriceUsd)}
          </span>
        ) : null}
      </p>
      {statusReason ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Motivo: {statusReason}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Acción</span>
          <select
            value={next}
            onChange={(e) =>
              setNext(e.target.value as "paused" | "sold" | "published")
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-foreground"
          >
            {status !== "paused" && status !== "sold" ? (
              <option value="paused">Pausar</option>
            ) : null}
            {status !== "sold" ? (
              <option value="sold">{closedLabel}</option>
            ) : null}
            {status !== "published" ? (
              <option value="published">Volver a publicar</option>
            ) : null}
          </select>
        </label>

        {next === "paused" || next === "sold" ? (
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Motivo *</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              minLength={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder={
                next === "sold"
                  ? "Ej. Cerrado con comprador de visita…"
                  : "Ej. En remodelación, vuelvo en dos semanas…"
              }
            />
          </label>
        ) : null}

        {next === "sold" ? (
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">{priceLabel} *</span>
            <input
              type="number"
              min={1}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Ej. 185000"
            />
          </label>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={() => void submit()}
          className="interactive-surface h-11 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          {busy ? "Guardando…" : "Guardar estado"}
        </button>
      </div>
    </aside>
  );
}
