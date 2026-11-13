"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { CITIES } from "@/data/cities";
import type { LatLng } from "@/data/geo";
import { LocationPickerLazy } from "@/components/explore/location-picker-lazy";
import { UploadButton, uploadThingFileUrl } from "@/lib/uploadthing";

export function PublishWizard() {
  const router = useRouter();
  const createDraft = useMutation(api.listings.createDraft);
  const updateListing = useMutation(api.listings.updateListing);
  const publishListing = useMutation(api.listings.publishListing);

  const [step, setStep] = useState(1);
  const [listingId, setListingId] = useState<Id<"listings"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "apartamentos" as "apartamentos" | "casas",
    operationType: "venta" as "venta" | "alquiler",
    cityId: "caracas",
    neighborhood: "",
    priceUsd: "",
    administrationUsd: "",
    beds: "2",
    baths: "2",
    areaM2: "",
    description: "",
    features: "",
    contactWhatsapp: "",
    showWhatsapp: false,
    lat: null as number | null,
    lng: null as number | null,
    images: [] as string[],
  });

  async function ensureDraft() {
    if (listingId) return listingId;
    const id = await createDraft({
      title: form.title.trim() || "Borrador Musas",
      type: form.type,
      operationType: form.operationType,
      cityId: form.cityId,
    });
    setListingId(id);
    return id;
  }

  async function saveDetails() {
    if (!form.neighborhood.trim()) {
      toast.error("Indica urbanización / sector (ej. Altamira)");
      return;
    }
    if (form.description.trim().length < 40) {
      toast.error("La descripción necesita al menos 40 caracteres");
      return;
    }
    if (!Number(form.priceUsd)) {
      toast.error(
        form.operationType === "alquiler"
          ? "Indica la renta mensual en USD"
          : "Indica el precio de venta en USD",
      );
      return;
    }
    if (
      form.lat == null ||
      form.lng == null ||
      !Number.isFinite(form.lat) ||
      !Number.isFinite(form.lng)
    ) {
      toast.error("Marca la ubicación en el mapa (toca o arrastra el pin)");
      return;
    }
    setBusy(true);
    try {
      const id = await ensureDraft();
      await updateListing({
        id,
        title: form.title.trim(),
        type: form.type,
        operationType: form.operationType,
        cityId: form.cityId,
        neighborhood: form.neighborhood.trim(),
        priceUsd: Number(form.priceUsd) || 0,
        administrationUsd: Number(form.administrationUsd) || 0,
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        areaM2: Number(form.areaM2) || 0,
        description: form.description.trim(),
        features: form.features
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        contactWhatsapp: form.showWhatsapp
          ? form.contactWhatsapp.trim()
          : "",
        lat: form.lat,
        lng: form.lng,
        images: form.images,
        alt: form.title.trim(),
      });
      toast.success("Borrador guardado");
      setStep(3);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!listingId) return;
    setBusy(true);
    try {
      await updateListing({ id: listingId, images: form.images });
      await publishListing({ id: listingId });
      toast.success("Inmueble publicado");
      router.push("/dashboard/inmuebles");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo publicar");
    } finally {
      setBusy(false);
    }
  }

  const checklist = [
    { n: 1, label: "Básicos (venta/alquiler, título, ciudad)" },
    {
      n: 2,
      label:
        form.operationType === "alquiler"
          ? "Detalle, renta USD/mes y pin en mapa"
          : "Detalle, precio USD y pin en mapa",
    },
    { n: 3, label: "Fotos (mín. 1) y publicar" },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold text-foreground">Publicar inmueble</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Venta o alquiler en USD. Completa la checklist — sin letra chica.
      </p>
      <ol className="mt-6 space-y-2" aria-label="Checklist de publicación">
        {checklist.map((item) => {
          const done = step > item.n;
          const current = step === item.n;
          return (
            <li
              key={item.n}
              className={`flex items-center gap-3 text-sm ${
                current
                  ? "text-neon"
                  : done
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
              }`}
            >
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  current
                    ? "border-neon bg-neon/15"
                    : done
                      ? "border-neon/50 text-neon"
                      : "border-border"
                }`}
                aria-hidden
              >
                {done ? "✓" : item.n}
              </span>
              <span>
                {item.label}
                {current ? " · en curso" : done ? " · listo" : ""}
              </span>
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <div className="mt-8 space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-sm text-muted-foreground">Operación</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["venta", "Vendo"],
                  ["alquiler", "Alquilo"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm({ ...form, operationType: id })}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    form.operationType === id
                      ? "border-neon bg-neon/15 text-neon"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Título</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Ej. Apartamento Altamira"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Tipo</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "apartamentos" | "casas",
                })
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            >
              <option value="apartamentos">Apartamento</option>
              <option value="casas">Casa</option>
            </select>
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Ciudad</span>
            <select
              value={form.cityId}
              onChange={(e) =>
                setForm({
                  ...form,
                  cityId: e.target.value,
                  lat: null,
                  lng: null,
                })
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!form.title.trim()}
            onClick={() => setStep(2)}
            className="interactive-surface mt-4 inline-flex h-11 items-center rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-8 space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Urbanización / sector</span>
            <input
              value={form.neighborhood}
              onChange={(e) =>
                setForm({ ...form, neighborhood: e.target.value })
              }
              placeholder="Los Palos Grandes"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            />
          </label>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ubicación en el mapa</p>
            <p className="text-xs text-muted-foreground">
              Toca el mapa o arrastra el pin. Obligatorio para publicar — así
              sale en la búsqueda por mapa.
            </p>
            <LocationPickerLazy
              cityId={form.cityId}
              value={
                form.lat != null && form.lng != null
                  ? { lat: form.lat, lng: form.lng }
                  : null
              }
              onChange={(coords: LatLng) =>
                setForm({ ...form, lat: coords.lat, lng: coords.lng })
              }
            />
            {form.lat != null && form.lng != null ? (
              <p className="text-[11px] text-neon/80">
                Pin: {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
              </p>
            ) : (
              <p className="text-[11px] text-amber-200/80">
                Sin pin — toca el mapa para marcar.
              </p>
            )}
          </div>
          {(
            [
              [
                "priceUsd",
                form.operationType === "alquiler"
                  ? "Renta mensual (USD / mes)"
                  : "Precio de venta (USD)",
                form.operationType === "alquiler" ? "1100" : "220000",
              ],
              [
                "administrationUsd",
                "Administración USD / mes (si aplica)",
                "180",
              ],
              ["beds", "Habitaciones", "3"],
              ["baths", "Baños", "2"],
              ["areaM2", "Área m²", "145"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <label key={key} className="block space-y-1.5 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              />
            </label>
          ))}
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Descripción (mín. 40 caracteres)</span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            />
            <span className="text-xs text-muted-foreground">
              {form.description.trim().length}/40 · incluye luz, vista, puestos
            </span>
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">
              Características (separadas por coma)
            </span>
            <input
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Balcón, 2 puestos, vigilancia"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            />
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={form.showWhatsapp}
              onChange={(e) =>
                setForm({ ...form, showWhatsapp: e.target.checked })
              }
              className="mt-1"
            />
            <span className="space-y-1">
              <span className="block text-foreground">
                Mostrar WhatsApp en la ficha (opt-in)
              </span>
              <span className="block text-xs text-muted-foreground">
                Opcional. Si no marcas, el contacto sigue por preguntas en
                Musas.
              </span>
            </span>
          </label>
          {form.showWhatsapp ? (
            <label className="block space-y-1.5 text-sm">
              <span className="text-muted-foreground">WhatsApp (con código país)</span>
              <input
                value={form.contactWhatsapp}
                onChange={(e) =>
                  setForm({ ...form, contactWhatsapp: e.target.value })
                }
                placeholder="58412xxxxxxx"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              />
            </label>
          ) : null}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
            >
              Atrás
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveDetails()}
              className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground"
            >
              Guardar y seguir
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-8 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Fotos: mínimo 1 para publicar. Recomendamos{" "}
              <strong className="text-foreground">3–6 fotos</strong> (fachada,
              sala, cocina, habitación). ¿Sesión profesional?{" "}
              <Link href="/preferencial" className="text-neon hover:underline">
                Preferencial
              </Link>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {form.images.length} foto{form.images.length === 1 ? "" : "s"}
              {form.images.length > 0 && form.images.length < 3
                ? " · añade más para mejorar la ficha"
                : ""}
            </p>
            <div className="mt-3">
              <UploadButton
                endpoint="listingImageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res
                    .map((f) => uploadThingFileUrl(f))
                    .filter((u): u is string => Boolean(u));
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, ...urls],
                  }));
                  toast.success(
                    urls.length
                      ? "Fotos subidas"
                      : "Subida OK pero sin URL — reintenta",
                  );
                }}
                onUploadError={(e) => {
                  void toast.error(e.message);
                }}
              />
            </div>
            {form.images.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="aspect-[4/3] rounded-lg object-cover"
                  />
                ))}
              </ul>
            ) : null}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="h-11 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
            >
              Atrás
            </button>
            <button
              type="button"
              disabled={busy || form.images.length < 1}
              onClick={() => void publish()}
              className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {form.operationType === "alquiler"
                ? "Publicar alquiler"
                : "Publicar en venta"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Al publicar, la ficha queda visible de inmediato
            {form.operationType === "alquiler" ? " como alquiler USD/mes" : ""}.
            El tag <span className="text-neon">Musas Revisado</span> lo pone el
            equipo después.{" "}
            {form.operationType === "venta" ? (
              <>
                ¿Fotos o acompañamiento?{" "}
                <Link
                  href="/preferencial"
                  className="text-neon hover:underline"
                >
                  Preferencial
                </Link>
                .
              </>
            ) : (
              "Preferencial aplica a venta; alquiler se coordina directo."
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
}
