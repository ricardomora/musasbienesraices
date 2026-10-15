export type CityId =
  | "caracas"
  | "valencia"
  | "maracaibo"
  | "barquisimeto"
  | "merida"
  | "puerto-ordaz"
  | "lecheria";

export type City = {
  id: CityId;
  name: string;
};

export const CITIES: City[] = [
  { id: "caracas", name: "Caracas" },
  { id: "valencia", name: "Valencia" },
  { id: "maracaibo", name: "Maracaibo" },
  { id: "barquisimeto", name: "Barquisimeto" },
  { id: "merida", name: "Mérida" },
  { id: "puerto-ordaz", name: "Puerto Ordaz" },
  { id: "lecheria", name: "Lechería" },
];

export function cityName(id: CityId): string {
  return CITIES.find((c) => c.id === id)?.name ?? id;
}
