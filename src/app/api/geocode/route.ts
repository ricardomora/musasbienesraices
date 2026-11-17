import { NextResponse } from "next/server";
import { CITY_CENTROIDS } from "@/data/geo";
import { cityName, type CityId } from "@/data/cities";

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
};

/**
 * Proxy Nominatim (OpenStreetMap) para autocompletar sectores en VE.
 * Bias por ciudad Musas.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const cityId = searchParams.get("cityId")?.trim() || "caracas";

  if (q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const center = CITY_CENTROIDS[cityId] ?? CITY_CENTROIDS.caracas;
  const city =
    cityName(cityId as CityId) ||
    cityId.replace(/-/g, " ");
  const query = `${q}, ${city}, Venezuela`;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "ve");
  url.searchParams.set("addressdetails", "0");
  // Soft viewbox ~0.35° around city center
  const d = 0.35;
  url.searchParams.set(
    "viewbox",
    `${center.lng - d},${center.lat + d},${center.lng + d},${center.lat - d}`,
  );
  url.searchParams.set("bounded", "0");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "MusasBienesRaices/1.0 (contacto@musas.app)",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }
    const data = (await res.json()) as NominatimItem[];
    const results = data.map((item) => {
      const parts = item.display_name.split(",").map((p) => p.trim());
      const label = parts.slice(0, 2).join(", ") || item.display_name;
      return {
        id: `geo:${item.place_id}`,
        label,
        cityId,
        lat: Number(item.lat),
        lng: Number(item.lon),
        source: "geocode" as const,
      };
    });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
