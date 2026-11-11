import { cityName, type CityId } from "./cities";

export type PropertyType = "apartamentos" | "casas";

export type Listing = {
  id: string;
  slug: string;
  type: PropertyType;
  cityId: CityId;
  neighborhood: string;
  title: string;
  badge?: string;
  priceUsd: number;
  beds: number;
  baths: number;
  areaM2: number;
  image: string;
  alt: string;
  description: string;
  administrationUsd: number;
  features: string[];
};

export type BudgetOption = {
  id: string;
  label: string;
  maxUsd: number | null;
};

export const BUDGET_OPTIONS: BudgetOption[] = [
  { id: "any", label: "Cualquier precio (USD)", maxUsd: null },
  { id: "150", label: "Hasta USD 150.000", maxUsd: 150_000 },
  { id: "250", label: "Hasta USD 250.000", maxUsd: 250_000 },
  { id: "400", label: "Hasta USD 400.000", maxUsd: 400_000 },
  { id: "600", label: "Hasta USD 600.000", maxUsd: 600_000 },
  { id: "900", label: "Hasta USD 900.000", maxUsd: 900_000 },
];

export const LISTINGS: Listing[] = [
  {
    id: "casa-avila",
    slug: "casa-avila-caracas",
    type: "casas",
    cityId: "caracas",
    neighborhood: "Los Palos Grandes",
    title: "Casa Ávila",
    badge: "Selección Musas",
    priceUsd: 485_000,
    beds: 4,
    baths: 4,
    areaM2: 380,
    image: "/villa-dusk.png",
    alt: "Casa moderna al atardecer con piscina",
    description:
      "Arquitectura que se abre al paisaje. Espacios generosos, terraza con vista al Ávila y piscina privada en uno de los sectores más buscados de Caracas.",
    administrationUsd: 420,
    features: [
      "Piscina privada",
      "Terraza panorámica",
      "3 puestos de estacionamiento",
      "Jardín privado",
    ],
  },
  {
    id: "apto-altamira",
    slug: "apto-altamira-caracas",
    type: "apartamentos",
    cityId: "caracas",
    neighborhood: "Altamira",
    title: "Apartamento Altamira",
    badge: "Nuevo en Musas",
    priceUsd: 220_000,
    beds: 3,
    baths: 2,
    areaM2: 145,
    image: "/penthouse-interior.png",
    alt: "Interior luminoso de apartamento",
    description:
      "Luz natural en cada rincón. Planta abierta, cocina integrada y balcón amplio a pasos de Plaza Altamira.",
    administrationUsd: 180,
    features: [
      "Balcón amplio",
      "Cocina integrada",
      "2 puestos de estacionamiento",
      "Lobby con vigilancia",
    ],
  },
  {
    id: "penthouse-chacao",
    slug: "penthouse-chacao-caracas",
    type: "apartamentos",
    cityId: "caracas",
    neighborhood: "Chacao",
    title: "Penthouse Chacao",
    badge: "Selección Musas",
    priceUsd: 620_000,
    beds: 3,
    baths: 3,
    areaM2: 260,
    image: "/section-interior.jpg",
    alt: "Penthouse con vista urbana",
    description:
      "Vista abierta a la ciudad y acabados contemporáneos. Ideal para quien busca altura, privacidad y una ficha clara de punta a punta.",
    administrationUsd: 510,
    features: [
      "Vista panorámica",
      "Terraza privada",
      "Ascensor directo",
      "2 puestos de estacionamiento",
    ],
  },
  {
    id: "casa-naguara",
    slug: "casa-naguara-valencia",
    type: "casas",
    cityId: "valencia",
    neighborhood: "Naguara",
    title: "Casa Naguara",
    priceUsd: 310_000,
    beds: 4,
    baths: 3,
    areaM2: 290,
    image: "/villa-day.png",
    alt: "Casa de día con jardín y piscina",
    description:
      "Casa familiar con jardín tropical y áreas sociales integradas. Pensada para vivir con espacio, sin complicaciones.",
    administrationUsd: 95,
    features: [
      "Piscina",
      "Jardín tropical",
      "Área de BBQ",
      "2 puestos de estacionamiento",
    ],
  },
  {
    id: "apto-el-vifaro",
    slug: "apto-el-vifaro-valencia",
    type: "apartamentos",
    cityId: "valencia",
    neighborhood: "El Viñedo",
    title: "Apartamento El Viñedo",
    badge: "Nuevo en Musas",
    priceUsd: 145_000,
    beds: 2,
    baths: 2,
    areaM2: 98,
    image: "/hero-property.jpg",
    alt: "Fachada residencial moderna",
    description:
      "Apartamento práctico y luminoso en un conjunto consolidado. Precio claro, distribución sencilla y listo para visitar.",
    administrationUsd: 70,
    features: [
      "Piso alto",
      "Áreas comunes",
      "1 puesto de estacionamiento",
      "Cerca de servicios",
    ],
  },
  {
    id: "casa-lago",
    slug: "casa-lago-maracaibo",
    type: "casas",
    cityId: "maracaibo",
    neighborhood: "La Lago",
    title: "Casa La Lago",
    badge: "Selección Musas",
    priceUsd: 275_000,
    beds: 5,
    baths: 4,
    areaM2: 340,
    image: "/villa-dusk.png",
    alt: "Casa con terraza al anochecer",
    description:
      "Residencia amplia con terraza y espacios para convivir. Una opción sólida para familias que buscan metro cuadrado real.",
    administrationUsd: 110,
    features: [
      "Terraza",
      "Sala doble altura",
      "Estudio",
      "3 puestos de estacionamiento",
    ],
  },
  {
    id: "apto-bella-vista",
    slug: "apto-bella-vista-maracaibo",
    type: "apartamentos",
    cityId: "maracaibo",
    neighborhood: "Bella Vista",
    title: "Apartamento Bella Vista",
    priceUsd: 118_000,
    beds: 2,
    baths: 2,
    areaM2: 110,
    image: "/penthouse-interior.png",
    alt: "Sala moderna con luz natural",
    description:
      "Planta eficiente con buena iluminación. Ideal como primer hogar o inversión con información completa desde el inicio.",
    administrationUsd: 55,
    features: [
      "Sala-comedor integrada",
      "Closets empotrados",
      "1 puesto de estacionamiento",
      "Vigilancia 24h",
    ],
  },
  {
    id: "casa-cabudare",
    slug: "casa-cabudare-barquisimeto",
    type: "casas",
    cityId: "barquisimeto",
    neighborhood: "Cabudare",
    title: "Casa Cabudare",
    priceUsd: 195_000,
    beds: 3,
    baths: 3,
    areaM2: 240,
    image: "/villa-day.png",
    alt: "Casa blanca con vegetación tropical",
    description:
      "Diseño contemporáneo rodeado de vegetación. Espacios sociales conectados al exterior para vivir con calma.",
    administrationUsd: 40,
    features: [
      "Patio interior",
      "Cocina abierta",
      "2 puestos de estacionamiento",
      "Cuarto de servicio",
    ],
  },
  {
    id: "apto-centro",
    slug: "apto-centro-barquisimeto",
    type: "apartamentos",
    cityId: "barquisimeto",
    neighborhood: "Centro",
    title: "Apartamento Centro",
    badge: "Nuevo en Musas",
    priceUsd: 95_000,
    beds: 2,
    baths: 1,
    areaM2: 82,
    image: "/section-street.jpg",
    alt: "Edificio residencial en calle urbana",
    description:
      "Ubicación céntrica y ficha transparente. Perfecto para quien prioriza acceso, precio claro y un proceso simple.",
    administrationUsd: 35,
    features: [
      "Ubicación céntrica",
      "Edificio con ascensor",
      "Cerca del transporte",
      "Bajo mantenimiento",
    ],
  },
  {
    id: "casa-andina",
    slug: "casa-andina-merida",
    type: "casas",
    cityId: "merida",
    neighborhood: "La Pedregosa",
    title: "Casa Andina",
    badge: "Selección Musas",
    priceUsd: 240_000,
    beds: 4,
    baths: 3,
    areaM2: 310,
    image: "/villa-day.png",
    alt: "Residencia con paisaje montañoso",
    description:
      "Ambiente andino y espacios generosos. Una casa para desconectar del ritmo urbano sin perder confort.",
    administrationUsd: 60,
    features: [
      "Vista a la montaña",
      "Chimenea",
      "Jardín amplio",
      "2 puestos de estacionamiento",
    ],
  },
  {
    id: "apto-ordaz",
    slug: "apto-alta-vista-puerto-ordaz",
    type: "apartamentos",
    cityId: "puerto-ordaz",
    neighborhood: "Alta Vista",
    title: "Apartamento Alta Vista",
    priceUsd: 132_000,
    beds: 3,
    baths: 2,
    areaM2: 125,
    image: "/penthouse-interior.png",
    alt: "Apartamento con vista abierta",
    description:
      "Tres habitaciones con buena ventilación y vista abierta. Datos de precio, área y administración en un solo lugar.",
    administrationUsd: 65,
    features: [
      "Vista abierta",
      "Áreas verdes del conjunto",
      "2 puestos de estacionamiento",
      "Depósito",
    ],
  },
  {
    id: "casa-lecheria",
    slug: "casa-playa-lecheria",
    type: "casas",
    cityId: "lecheria",
    neighborhood: "Lechería Norte",
    title: "Casa Playa Norte",
    badge: "Selección Musas",
    priceUsd: 390_000,
    beds: 4,
    baths: 4,
    areaM2: 360,
    image: "/villa-dusk.png",
    alt: "Casa costera con iluminación cálida",
    description:
      "Residencia costera con iluminación cálida y áreas sociales amplias. Pensada para quienes buscan confort frente al mar.",
    administrationUsd: 280,
    features: [
      "Cerca de la playa",
      "Piscina",
      "Terraza",
      "3 puestos de estacionamiento",
    ],
  },
];

export type SearchFilters = {
  cityId: CityId | "all";
  type: PropertyType | "all";
  budgetMaxUsd: number | null;
  favoritesOnly: boolean;
};

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function listingLocation(listing: Listing): string {
  return `${listing.neighborhood}, ${cityName(listing.cityId)}`;
}

export function filterListings(
  listings: Listing[],
  filters: SearchFilters,
  favoriteIds: Set<string>,
): Listing[] {
  return listings.filter((listing) => {
    if (filters.favoritesOnly && !favoriteIds.has(listing.id)) return false;
    if (filters.cityId !== "all" && listing.cityId !== filters.cityId) {
      return false;
    }
    if (filters.type !== "all" && listing.type !== filters.type) return false;
    if (
      filters.budgetMaxUsd != null &&
      listing.priceUsd > filters.budgetMaxUsd
    ) {
      return false;
    }
    return true;
  });
}
