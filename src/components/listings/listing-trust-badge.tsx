import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingTrustBadgeProps = {
  trustBadge?: "none" | "musas_reviewed" | null;
  reviewedAt?: number;
  /** Overlay on photo (dark glass) vs inline on card footer */
  variant?: "overlay" | "inline";
  className?: string;
};

function GreenCheck({ solid }: { solid?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-3.5 shrink-0 items-center justify-center rounded-full",
        solid ? "bg-white text-emerald-600" : "bg-emerald-500 text-white",
      )}
      aria-hidden
    >
      <Check className="size-2.5 stroke-[3]" />
    </span>
  );
}

export function ListingTrustBadge({
  trustBadge,
  reviewedAt,
  variant = "overlay",
  className,
}: ListingTrustBadgeProps) {
  const verified = trustBadge === "musas_reviewed";
  const dateLabel =
    verified && reviewedAt
      ? new Date(reviewedAt).toLocaleDateString("es-VE")
      : null;

  if (verified) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] font-semibold",
          variant === "overlay"
            ? "rounded-full bg-emerald-500 px-2.5 py-1 text-white shadow-sm"
            : "text-emerald-600 dark:text-emerald-400",
          className,
        )}
        title="Musas revisó fotos, precio USD y contacto — no es certificación legal."
      >
        <GreenCheck solid={variant === "overlay"} />
        Musas Revisado
        {dateLabel && variant === "overlay" ? (
          <span className="font-normal opacity-90">· {dateLabel}</span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium",
        variant === "overlay"
          ? "rounded-full border border-white/25 bg-ink/70 px-2.5 py-1 text-white/85 backdrop-blur-md"
          : "text-muted-foreground",
        className,
      )}
      title="Publicado y visible. El equipo Musas aún no lo revisó."
    >
      En verificación
    </span>
  );
}
