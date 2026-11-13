"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type DemoInfoKind = "sell" | "visit";

type DemoInfoDialogProps = {
  kind: DemoInfoKind | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueExploring?: () => void;
};

const COPY: Record<
  DemoInfoKind,
  { title: string; body: string; primary: "explore" | "landing" }
> = {
  sell: {
    title: "Publicar en venta (USD)",
    body: "Este entorno local aún no tiene Clerk + Convex. Con keys Musas activas publicas desde /publicar. Mientras tanto, puedes pedir acceso anticipado.",
    primary: "landing",
  },
  visit: {
    title: "Ficha de ejemplo",
    body: "Esta ficha es del seed local. Con backend Musas, preguntas y favoritos van contra inmuebles reales en venta (USD).",
    primary: "explore",
  },
};

export function DemoInfoDialog({
  kind,
  open,
  onOpenChange,
  onContinueExploring,
}: DemoInfoDialogProps) {
  const content = kind ? COPY[kind] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <div className="inline-flex size-12 items-center justify-center rounded-full border border-neon/40 text-neon">
          <Home className="size-5" aria-hidden />
        </div>
        {content ? (
          <>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.body}</DialogDescription>
            <div className="flex flex-wrap gap-3 pt-1">
              {content.primary === "landing" ? (
                <Link
                  href="/landing#acceso"
                  className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
                >
                  Pedir acceso anticipado
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onContinueExploring?.();
                  }}
                  className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
                >
                  Seguir explorando
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
              {content.primary === "landing" ? (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onContinueExploring?.();
                  }}
                  className="interactive-surface inline-flex h-11 items-center rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
                >
                  Seguir explorando
                </button>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
