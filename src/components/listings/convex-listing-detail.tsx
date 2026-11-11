"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { cityName, type CityId } from "@/data/cities";
import { formatUsd } from "@/data/listings";
import { useAuthFavorites } from "@/hooks/use-auth-favorites";

export function ConvexListingDetail({ slug }: { slug: string }) {
  const listing = useQuery(api.listings.getBySlug, { slug });
  const threads = useQuery(
    api.questions.listForListing,
    listing ? { listingId: listing._id } : "skip",
  );
  const ask = useMutation(api.questions.ask);
  const answer = useMutation(api.questions.answer);
  const { isSignedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useAuthFavorites();
  const [question, setQuestion] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  if (listing === undefined) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Cargando ficha…
      </main>
    );
  }

  if (listing === null) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-muted-foreground">Inmueble no encontrado.</p>
        <Link href="/" className="mt-4 inline-block text-neon">
          Volver al inicio
        </Link>
      </main>
    );
  }

  const liked = isFavorite(listing._id);
  const image = listing.images[0] ?? "/villa-dusk.png";

  return (
    <main className="flex-1 bg-background pb-20">
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <Link
          href="/#inmuebles"
          className="interactive-surface inline-flex items-center gap-2 text-sm text-white/70 hover:text-neon"
        >
          <ArrowLeft className="size-4" /> Volver
        </Link>

        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={image}
            alt={listing.alt ?? listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48rem"
            priority
            unoptimized={image.startsWith("http")}
          />
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 text-neon/80" />
          {listing.neighborhood}, {cityName(listing.cityId as CityId)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {listing.title}
        </h1>
        {listing.badge ? (
          <p className="mt-2 text-xs tracking-wide text-neon uppercase">
            {listing.badge}
          </p>
        ) : null}
        <p className="mt-4 text-muted-foreground">{listing.description}</p>
        <p className="mt-4 text-2xl font-semibold text-white">
          {formatUsd(listing.priceUsd)}{" "}
          <span className="text-sm font-normal text-muted-foreground">USD</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" /> {listing.beds} habitaciones
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5" /> {listing.baths} baños
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="size-3.5" /> {listing.areaM2} m²
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
          <span className="text-muted-foreground">Administración mensual</span>
          <strong className="text-white">
            {formatUsd(listing.administrationUsd)}
          </strong>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {listing.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/85"
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
            className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white"
          >
            <Heart className={`size-4 ${liked ? "fill-neon text-neon" : ""}`} />
            {liked ? "Guardado" : "Guardar inmueble"}
          </button>
          {listing.isOwner ? (
            <Link
              href={`/dashboard/inmuebles/${listing._id}`}
              className="interactive-surface inline-flex h-11 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
            >
              Editar ficha
            </Link>
          ) : null}
        </div>

        <section
          className="mt-14 border-t border-white/10 pt-10"
          id="preguntar"
        >
          <h2 className="text-xl font-semibold text-white">
            Preguntar al vendedor
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preguntas públicas en la ficha — queda el historial, sin chats
            sueltos.
          </p>

          {!isSignedIn ? (
            <div className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-muted-foreground">
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
                <span className="text-sm text-white/70">Tu pregunta</span>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder="¿Está disponible la visita este fin de semana? (mín. 10 caracteres)"
                  className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-neon/50"
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
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p className="text-xs text-muted-foreground">{t.askerName}</p>
                <p className="mt-1 text-white">{t.body}</p>
                {t.answer ? (
                  <div className="mt-3 border-l-2 border-neon/40 pl-3">
                    <p className="text-xs text-neon">Respuesta del vendedor</p>
                    <p className="mt-1 text-sm text-white/90">{t.answer.body}</p>
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
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
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
  );
}
