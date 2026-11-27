"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ListingPreferentialModule } from "@/components/dashboard/listing-preferential-module";
import { ListingStatusModule } from "@/components/dashboard/listing-status-module";
import { CITIES } from "@/data/cities";
import type { LatLng } from "@/data/geo";
import { LocationPickerLazy } from "@/components/explore/location-picker-lazy";
import { SectorAutocomplete } from "@/components/sell/sector-autocomplete";
import { ListingImageUploadButton } from "@/components/sell/listing-image-upload-button";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  showsBedsBaths,
  showsLotM2,
  type PropertyType,
} from "@/lib/property-types";
import { Trash2 } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground";
const selectClass = `${fieldClass} pr-10`;
const pairClass = "grid gap-4 sm:grid-cols-2";

function EditListing() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id as Id<"listings">;
  const listing = useQuery(api.listings.getMine, { id });
  const preferentialRequests = useQuery(api.preferential.myRequests);
  const updateListing = useMutation(api.listings.updateListing);
  const publishListing = useMutation(api.listings.publishListing);
  const [form, setForm] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [pin, setPin] = useState<LatLng | null>(null);
  const [mapNonce, setMapNonce] = useState(0);

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
      contactInstagram: listing.contactInstagram ?? "",
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
    <div className="mx-auto w-full max-w-[96rem] px-5 py-10 sm:px-8 lg:px-12">
      <h1 className="text-2xl font-semibold text-foreground">Editar inmueble</h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[7fr_3fr] lg:gap-8">
        <div className="min-w-0 space-y-4">
          <div className={pairClass}>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Operación</span>
              <select
                value={form.operationType ?? "venta"}
                onChange={(e) =>
                  setForm({ ...form, operationType: e.target.value })
                }
                className={selectClass}
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler (USD/mes)</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Tipo</span>
              <select
                value={form.type ?? "apartamentos"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={selectClass}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PROPERTY_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Título</span>
            <input
              value={form.title ?? ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={fieldClass}
            />
          </label>

          <div className={pairClass}>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Ciudad</span>
              <select
                value={form.cityId}
                onChange={(e) => {
                  setForm({ ...form, cityId: e.target.value });
                  setPin(null);
                }}
                className={selectClass}
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Urbanización / sector</span>
              <SectorAutocomplete
                cityId={form.cityId || "caracas"}
                value={form.neighborhood ?? ""}
                onChange={(neighborhood) =>
                  setForm({ ...form, neighborhood })
                }
                onSelectPlace={({ label, coords }) => {
                  setForm({ ...form, neighborhood: label });
                  setPin(coords);
                  setMapNonce((n) => n + 1);
                }}
              />
            </label>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Elige una sugerencia de sector para centrar el mapa y colocar el
            pin.
          </p>

          <div className={pairClass}>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">
                {form.operationType === "alquiler"
                  ? "Renta USD / mes"
                  : "Precio USD"}
              </span>
              <input
                value={form.priceUsd ?? ""}
                onChange={(e) =>
                  setForm({ ...form, priceUsd: e.target.value })
                }
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">
                Condominio USD / mes
              </span>
              <input
                value={form.administrationUsd ?? ""}
                onChange={(e) =>
                  setForm({ ...form, administrationUsd: e.target.value })
                }
                className={fieldClass}
              />
            </label>
          </div>

          {showsBedsBaths((form.type as PropertyType) || "apartamentos") ? (
            <div className={pairClass}>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Habitaciones</span>
                <input
                  value={form.beds ?? ""}
                  onChange={(e) => setForm({ ...form, beds: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Baños</span>
                <input
                  value={form.baths ?? ""}
                  onChange={(e) => setForm({ ...form, baths: e.target.value })}
                  className={fieldClass}
                />
              </label>
            </div>
          ) : null}

          <div
            className={
              showsLotM2((form.type as PropertyType) || "casas")
                ? pairClass
                : undefined
            }
          >
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">m² de construcción</span>
              <input
                value={form.areaM2 ?? ""}
                onChange={(e) => setForm({ ...form, areaM2: e.target.value })}
                className={fieldClass}
              />
            </label>
            {showsLotM2((form.type as PropertyType) || "casas") ? (
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">m² de terreno</span>
                <input
                  value={form.lotM2 ?? ""}
                  onChange={(e) => setForm({ ...form, lotM2: e.target.value })}
                  className={fieldClass}
                />
              </label>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ubicación en el mapa</p>
            <LocationPickerLazy
              cityId={form.cityId || "caracas"}
              value={pin}
              onChange={setPin}
              viewNonce={mapNonce}
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={5}
              className={fieldClass}
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Features (coma)</span>
            <input
              value={form.features ?? ""}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className={fieldClass}
            />
          </label>

          <div className={pairClass}>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">
                WhatsApp (vacío = oculto)
              </span>
              <input
                value={form.contactWhatsapp ?? ""}
                onChange={(e) =>
                  setForm({ ...form, contactWhatsapp: e.target.value })
                }
                placeholder="58412xxxxxxx"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">
                Instagram (vacío = perfil)
              </span>
              <input
                value={form.contactInstagram ?? ""}
                onChange={(e) =>
                  setForm({ ...form, contactInstagram: e.target.value })
                }
                placeholder="@tuagencia"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">Fotos del inmueble</p>
            <ListingImageUploadButton
              currentCount={images.length}
              onUploaded={(urls) => {
                setImages((prev) => [...prev, ...urls]);
              }}
            />
          </div>
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
                  contactInstagram: (form.contactInstagram ?? "").trim(),
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

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <ListingStatusModule
            listingId={id}
            status={listing.status}
            operationType={listing.operationType ?? "venta"}
            statusReason={listing.statusReason}
            soldPriceUsd={listing.soldPriceUsd}
          />
          <ListingPreferentialModule
            listingId={id}
            requests={preferentialRequests}
            compact
          />
        </aside>
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
