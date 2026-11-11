"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { CITIES } from "@/data/cities";
import { UploadButton } from "@/lib/uploadthing";

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
    cityId: "caracas",
    neighborhood: "",
    priceUsd: "",
    administrationUsd: "",
    beds: "2",
    baths: "2",
    areaM2: "",
    description: "",
    features: "",
    images: [] as string[],
  });

  async function ensureDraft() {
    if (listingId) return listingId;
    const id = await createDraft({
      title: form.title.trim() || "Borrador Musas",
      type: form.type,
      cityId: form.cityId,
    });
    setListingId(id);
    return id;
  }

  async function saveDetails() {
    setBusy(true);
    try {
      const id = await ensureDraft();
      await updateListing({
        id,
        title: form.title.trim(),
        type: form.type,
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
    { n: 1, label: "Básicos (título, tipo, ciudad)" },
    { n: 2, label: "Detalle y precio de venta en USD" },
    { n: 3, label: "Fotos (mín. 1) y publicar" },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold text-white">Publicar inmueble</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Solo venta en USD. Completa la checklist — sin letra chica.
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
                    ? "text-white/70"
                    : "text-white/40"
              }`}
            >
              <span
                className={`inline-flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  current
                    ? "border-neon bg-neon/15"
                    : done
                      ? "border-neon/50 text-neon"
                      : "border-white/20"
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
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Título</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
              placeholder="Ej. Apartamento Altamira"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Tipo</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "apartamentos" | "casas",
                })
              }
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
            >
              <option value="apartamentos">Apartamento</option>
              <option value="casas">Casa</option>
            </select>
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Ciudad</span>
            <select
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
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
          {(
            [
              ["neighborhood", "Urbanización / sector", "Los Palos Grandes"],
              ["priceUsd", "Precio de venta (USD)", "220000"],
              ["administrationUsd", "Administración USD / mes (si aplica)", "180"],
              ["beds", "Habitaciones", "3"],
              ["baths", "Baños", "2"],
              ["areaM2", "Área m²", "145"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <label key={key} className="block space-y-1.5 text-sm">
              <span className="text-white/70">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
              />
            </label>
          ))}
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">Descripción (mín. 40 caracteres)</span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={5}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-white/70">
              Características (separadas por coma)
            </span>
            <input
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Balcón, 2 puestos, vigilancia"
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 rounded-full border border-white/20 px-5 text-sm text-white"
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
            <p className="text-sm text-white/70">
              Fotos (mínimo 1). ¿Quieres sesión profesional?{" "}
              <Link href="/preferencial" className="text-neon hover:underline">
                Paquete Preferencial
              </Link>
            </p>
            <div className="mt-3">
              <UploadButton
                endpoint="listingImageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res.map((f) => f.url).filter(Boolean);
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, ...urls],
                  }));
                  toast.success("Fotos subidas");
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
              className="h-11 rounded-full border border-white/20 px-5 text-sm text-white"
            >
              Atrás
            </button>
            <button
              type="button"
              disabled={busy || form.images.length < 1}
              onClick={() => void publish()}
              className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Publicar en venta
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Al publicar, la ficha queda visible en explorar con precio en USD.
            ¿Quieres fotos o acompañamiento?{" "}
            <Link href="/preferencial" className="text-neon hover:underline">
              Preferencial
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
