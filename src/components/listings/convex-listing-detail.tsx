"use client";

import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Flag,
  Heart,
  Link2,
  MapPin,
  MessageCircle,
  Ruler,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { cityName, type CityId } from "@/data/cities";
import {
  formatListingPrice,
  formatUsd,
  listingOperation,
} from "@/data/listings";
import { useAuthFavorites } from "@/hooks/use-auth-favorites";
import { AppChrome } from "@/components/system/app-chrome";
import {
  REPORT_REASONS,
  type ReportReasonId,
} from "@/lib/report-reasons";

function whatsappHref(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function ConvexListingDetail({ slug }: { slug: string }) {
  const listing = useQuery(api.listings.getBySlug, { slug });
  const threads = useQuery(
    api.questions.listForListing,
    listing ? { listingId: listing._id } : "skip",
  );
  const ask = useMutation(api.questions.ask);
  const answer = useMutation(api.questions.answer);
  const reportListing = useMutation(api.reports.create);
  const { isSignedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useAuthFavorites();
  const [question, setQuestion] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] =
    useState<ReportReasonId>("precio_sospechoso");
  const [reportDetails, setReportDetails] = useState("");

  if (listing === undefined) {
    return (
      <AppChrome>
        <main className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Cargando ficha…
        </main>
      </AppChrome>
    );
  }

  if (listing === null) {
    return (
      <AppChrome>
        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="text-muted-foreground">Inmueble no encontrado.</p>
          <Link href="/" className="mt-4 inline-block text-neon">
            Volver al inicio
          </Link>
        </main>
      </AppChrome>
    );
  }

  const liked = isFavorite(listing._id);
  const gallery =
    listing.images.length > 0 ? listing.images : ["/villa-dusk.png"];
  const safeIndex = Math.min(activeImage, gallery.length - 1);
  const image = gallery[safeIndex] ?? gallery[0];
  const wa = listing.contactWhatsapp
    ? whatsappHref(listing.contactWhatsapp)
    : null;
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://musas.app/inmuebles/${listing.slug}`;
  const op = listingOperation(listing);
  const shareWa = `https://wa.me/?text=${encodeURIComponent(
    `${listing.title} — ${formatListingPrice(listing)} USD en Musas (${op})\n${pageUrl}`,
  )}`;
  const reviewedLabel =
    listing.trustBadge === "musas_reviewed" && listing.reviewedAt
      ? `Musas Revisado · ${new Date(listing.reviewedAt).toLocaleDateString("es-VE")}`
      : listing.trustBadge === "musas_reviewed"
        ? "Musas Revisado"
        : null;

  return (
    <AppChrome>
    <main className="flex-1 bg-background pb-20">
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <Link
          href="/#inmuebles"
          className="interactive-surface inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon"
        >
          <ArrowLeft className="size-4" /> Volver
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
          <div className="relative flex min-h-[220px] max-h-[70vh] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={listing.alt ?? listing.title}
              className="max-h-[70vh] w-full object-contain"
            />
          </div>
          {reviewedLabel ? (
            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-neon/50 bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-neon backdrop-blur-md"
              title="Revisamos fotos, precio USD y contacto del dueño — no certificamos agentes."
            >
              <ShieldCheck className="size-3.5" aria-hidden />
              {reviewedLabel}
            </span>
          ) : listing.status === "published" ? (
            <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-ink/70 px-2.5 py-1 text-[11px] text-white/75 backdrop-blur-md">
              Publicado · revisión Musas pendiente
            </span>
          ) : null}
        </div>

        {gallery.length > 1 ? (
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((src, i) => (
              <li key={`${src}-${i}`}>
                <button
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 ${
                    i === safeIndex
                      ? "border-neon"
                      : "border-border opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Foto ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 text-neon/80" />
          {listing.neighborhood}, {cityName(listing.cityId as CityId)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {listing.title}
        </h1>
        <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">
          {op === "alquiler" ? "Alquiler · USD / mes" : "Venta · USD"}
          {listing.badge ? ` · ${listing.badge}` : ""}
        </p>
        {listing.ownerAccountKind === "realtor" ? (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {listing.ownerName ?? "Realtor Musas"}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                listing.ownerRealtorVerified
                  ? "border-neon/50 text-neon"
                  : "border-border text-muted-foreground"
              }`}
              title={
                listing.ownerRealtorVerified
                  ? "Agente revisado por Musas (identidad profesional). No certifica la propiedad."
                  : "Publicado por un Realtor en Musas. Verificado pendiente."
              }
            >
              {listing.ownerRealtorVerified
                ? "Realtor Verificado"
                : "Realtor"}
            </span>
          </p>
        ) : null}
        <p className="mt-4 text-muted-foreground">{listing.description}</p>
        <p className="mt-4 text-2xl font-semibold text-foreground">
          {formatListingPrice(listing)}{" "}
          <span className="text-sm font-normal text-muted-foreground">USD</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {listing.beds > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-3.5" /> {listing.beds} habitaciones
            </span>
          ) : null}
          {listing.baths > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="size-3.5" /> {listing.baths} baños
            </span>
          ) : null}
          {listing.areaM2 > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="size-3.5" /> {listing.areaM2} m² construcción
            </span>
          ) : null}
          {listing.lotM2 && listing.lotM2 > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="size-3.5" /> {listing.lotM2} m² terreno
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Condominio mensual</span>
          <strong className="text-foreground">
            {formatUsd(listing.administrationUsd)}
          </strong>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {listing.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground"
            >
              <Check className="size-3 text-neon" />
              {f}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void toggleFavorite(listing._id)}
            className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
          >
            <Heart className={`size-4 ${liked ? "fill-neon text-neon" : ""}`} />
            {liked ? "Guardado" : "Guardar inmueble"}
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.location.href;
              void navigator.clipboard.writeText(url).then(
                () => toast.success("Link copiado — pásalo al grupo"),
                () => toast.error("No se pudo copiar"),
              );
            }}
            className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
          >
            <Link2 className="size-4" aria-hidden />
            Copiar link
          </button>
          <a
            href={shareWa}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
          >
            <Share2 className="size-4" aria-hidden />
            WhatsApp grupo
          </a>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-neon/40 px-5 text-sm text-neon hover:bg-neon/10"
            >
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp vendedor
            </a>
          ) : null}
          {listing.isOwner ? (
            <Link
              href={`/dashboard/inmuebles/${listing._id}`}
              className="interactive-surface inline-flex h-11 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
            >
              Editar ficha
            </Link>
          ) : null}
        </div>

        {!listing.isOwner ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowReport((v) => !v)}
              className="interactive-surface inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-200/90"
            >
              <Flag className="size-3.5" aria-hidden />
              ¿Precio o fotos no cuadran? Avísanos
            </button>
            {showReport ? (
              <form
                className="mt-3 space-y-3 rounded-xl border border-border bg-muted/30 p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void reportListing({
                    listingId: listing._id,
                    reason: reportReason,
                    details: reportDetails.trim() || undefined,
                  })
                    .then(() => {
                      toast.success("Reporte enviado a ops Musas");
                      setShowReport(false);
                      setReportDetails("");
                    })
                    .catch((err) =>
                      toast.error(
                        err instanceof Error ? err.message : "No se pudo enviar",
                      ),
                    );
                }}
              >
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Motivo</span>
                  <select
                    value={reportReason}
                    onChange={(e) =>
                      setReportReason(e.target.value as ReportReasonId)
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  >
                    {REPORT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Detalle (opcional)</span>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    placeholder="Ej. las fotos son de otro edificio…"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Enviar reporte
                </button>
              </form>
            ) : null}
          </div>
        ) : null}

        <section
          className="mt-14 border-t border-border pt-10"
          id="preguntar"
        >
          <h2 className="text-xl font-semibold text-foreground">
            Preguntar al vendedor
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preguntas públicas en la ficha — queda el historial, sin chats
            sueltos.
          </p>

          {!isSignedIn ? (
            <div className="mt-6 rounded-xl border border-border p-4 text-sm text-muted-foreground">
              <SignInButton mode="modal">
                <button type="button" className="text-neon underline">
                  Inicia sesión
                </button>
              </SignInButton>{" "}
              para preguntar sobre este inmueble.
            </div>
          ) : (
            <form
              className="mt-6 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  await ask({ listingId: listing._id, body: question });
                  setQuestion("");
                  toast.success("Pregunta enviada");
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "No se pudo enviar",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Tu pregunta</span>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder="¿Está disponible la visita este fin de semana? (mín. 10 caracteres)"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-neon/50"
                />
              </label>
              <button
                type="submit"
                disabled={busy || question.trim().length < 10}
                className="interactive-surface inline-flex h-10 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                Preguntar
              </button>
            </form>
          )}

          <ul className="mt-8 space-y-6">
            {(threads ?? []).map((t) => (
              <li
                key={t._id}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <p className="text-xs text-muted-foreground">{t.askerName}</p>
                <p className="mt-1 text-foreground">{t.body}</p>
                {t.answer ? (
                  <div className="mt-3 border-l-2 border-neon/40 pl-3">
                    <p className="text-xs text-neon">Respuesta del vendedor</p>
                    <p className="mt-1 text-sm text-foreground">{t.answer.body}</p>
                  </div>
                ) : listing.isOwner ? (
                  <form
                    className="mt-3 space-y-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const body = replyDrafts[t._id] ?? "";
                      try {
                        await answer({
                          questionId: t._id as Id<"questions">,
                          body,
                        });
                        toast.success("Respuesta publicada");
                        setReplyDrafts((d) => ({ ...d, [t._id]: "" }));
                      } catch (err) {
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : "No se pudo responder",
                        );
                      }
                    }}
                  >
                    <textarea
                      value={replyDrafts[t._id] ?? ""}
                      onChange={(e) =>
                        setReplyDrafts((d) => ({
                          ...d,
                          [t._id]: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder="Escribe tu respuesta…"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                    <button
                      type="submit"
                      className="text-sm font-medium text-neon hover:underline"
                    >
                      Responder
                    </button>
                  </form>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Esperando respuesta del vendedor
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
    </AppChrome>
  );
}
