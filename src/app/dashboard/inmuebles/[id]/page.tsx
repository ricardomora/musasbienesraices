"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { CITIES } from "@/data/cities";
import type { LatLng } from "@/data/geo";
import { LocationPickerLazy } from "@/components/explore/location-picker-lazy";
import { UploadButton, uploadThingFileUrl } from "@/lib/uploadthing";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  showsLotM2,
  type PropertyType,
} from "@/lib/property-types";
import { Trash2 } from "lucide-react";

function EditListing() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as Id<"listings">;
  const listing = useQuery(api.listings.getMine, { id });
  const updateListing = useMutation(api.listings.updateListing);
  const publishListing = useMutation(api.listings.publishListing);
  const [form, setForm] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [pin, setPin] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!listing) return;
    setForm({
      title: listing.title,
      type: listing.type,
      operationType: listing.operationType ?? "venta",
      cityId: listing.cityId,
      neighborhood: listing.neighborhood,
      priceUsd: String(listing.priceUsd),
      administrationUsd: String(listing.administrationUsd),
      beds: String(listing.beds),
      baths: String(listing.baths),
      areaM2: String(listing.areaM2),
      lotM2: String(listing.lotM2 ?? ""),
      description: listing.description,
      features: listing.features.join(", "),
      contactWhatsapp: listing.contactWhatsapp ?? "",
    });
    setImages(listing.images);
    setPin(
      typeof listing.lat === "number" && typeof listing.lng === "number"
        ? { lat: listing.lat, lng: listing.lng }
        : null,
    );
  }, [listing]);

  if (listing === undefined) {
    return <p className="p-10 text-muted-foreground">Cargando…</p>;
  }
  if (listing === null) {
    return <p className="p-10 text-muted-foreground">No encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Editar inmueble</h1>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Operación</span>
        <select
          value={form.operationType ?? "venta"}
          onChange={(e) =>
            setForm({ ...form, operationType: e.target.value })
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        >
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler (USD/mes)</option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Título</span>
        <input
          value={form.title ?? ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Tipo</span>
        <select
          value={form.type ?? "apartamentos"}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {PROPERTY_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      {(
        [
          ["neighborhood", "Sector"],
          [
            "priceUsd",
            form.operationType === "alquiler"
              ? "Renta USD / mes"
              : "Precio USD",
          ],
          ["administrationUsd", "Condominio USD / mes"],
          ["beds", "Habitaciones"],
          ["baths", "Baños"],
          ["areaM2", "m² de construcción"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <input
            value={form[key] ?? ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
          />
        </label>
      ))}
      {showsLotM2((form.type as PropertyType) || "casas") ? (
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">m² de terreno</span>
          <input
            value={form.lotM2 ?? ""}
            onChange={(e) => setForm({ ...form, lotM2: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
          />
        </label>
      ) : null}
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Ciudad</span>
        <select
          value={form.cityId}
          onChange={(e) => {
            setForm({ ...form, cityId: e.target.value });
            setPin(null);
          }}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Ubicación en el mapa</p>
        <LocationPickerLazy
          cityId={form.cityId || "caracas"}
          value={pin}
          onChange={setPin}
        />
        {pin ? (
          <p className="text-[11px] text-neon/80">
            Pin: {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
          </p>
        ) : (
          <p className="text-[11px] text-amber-200/80">
            Sin pin — obligatorio para publicar / salir en mapa.
          </p>
        )}
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Descripción</span>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Features (coma)</span>
        <input
          value={form.features ?? ""}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">
          WhatsApp en ficha (vacío = oculto)
        </span>
        <input
          value={form.contactWhatsapp ?? ""}
          onChange={(e) =>
            setForm({ ...form, contactWhatsapp: e.target.value })
          }
          placeholder="58412xxxxxxx"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
        />
      </label>
      <UploadButton
        endpoint="listingImageUploader"
        onClientUploadComplete={(res) => {
          const urls = res
            .map((f) => uploadThingFileUrl(f))
            .filter((u): u is string => Boolean(u));
          setImages((prev) => [...prev, ...urls]);
        }}
        onUploadError={(e) => {
          void toast.error(e.message);
        }}
      />
      {images.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src) => (
            <li
              key={src}
              className="relative overflow-hidden rounded-lg border border-border bg-muted/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="mx-auto max-h-48 w-full object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((u) => u !== src))
                }
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-red-500/85 px-2 py-1 text-[11px] text-white"
                aria-label="Eliminar foto"
              >
                <Trash2 className="size-3" aria-hidden />
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="button"
          className="h-11 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
          onClick={() => {
            if (!pin) {
              toast.error("Marca la ubicación en el mapa");
              return;
            }
            const type = (form.type as PropertyType) || "apartamentos";
            void updateListing({
              id,
              title: form.title,
              type,
              operationType: (form.operationType === "alquiler"
                ? "alquiler"
                : "venta") as "venta" | "alquiler",
              cityId: form.cityId,
              neighborhood: form.neighborhood,
              priceUsd: Number(form.priceUsd) || 0,
              administrationUsd: Number(form.administrationUsd) || 0,
              beds: Number(form.beds) || 0,
              baths: Number(form.baths) || 0,
              areaM2: Number(form.areaM2) || 0,
              lotM2: showsLotM2(type) ? Number(form.lotM2) || 0 : undefined,
              description: form.description,
              features: (form.features ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              contactWhatsapp: (form.contactWhatsapp ?? "").trim(),
              lat: pin.lat,
              lng: pin.lng,
              images,
            })
              .then(() => toast.success("Guardado"))
              .catch((e) =>
                toast.error(e instanceof Error ? e.message : "Error"),
              );
          }}
        >
          Guardar
        </button>
        <button
          type="button"
          className="h-11 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
          onClick={() =>
            void publishListing({ id })
              .then(() => {
                toast.success("Publicado");
                router.push(`/inmuebles/${listing.slug}`);
              })
              .catch((e) =>
                toast.error(e instanceof Error ? e.message : "Error"),
              )
          }
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default function EditListingPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="editar inmuebles">
        <DashboardNav />
        <EditListing />
      </BackendGate>
    </main>
  );
}
