export type CityId =
  | "caracas"
  | "valencia"
  | "maracaibo"
  | "barquisimeto"
  | "maracay"
  | "merida"
  | "puerto-ordaz"
  | "lecheria"
  | "barcelona"
  | "maturin"
  | "san-cristobal"
  | "ciudad-bolivar"
  | "porlamar"
  | "punto-fijo"
  | "cabimas";

export type City = {
  id: CityId;
  name: string;
  state: string;
};

/** Cobertura mapa nacional (ciudades principales VE). */
export const CITIES: City[] = [
  { id: "caracas", name: "Caracas", state: "Distrito Capital" },
  { id: "valencia", name: "Valencia", state: "Carabobo" },
  { id: "maracaibo", name: "Maracaibo", state: "Zulia" },
  { id: "barquisimeto", name: "Barquisimeto", state: "Lara" },
  { id: "maracay", name: "Maracay", state: "Aragua" },
  { id: "merida", name: "Mérida", state: "Mérida" },
  { id: "puerto-ordaz", name: "Puerto Ordaz", state: "Bolívar" },
  { id: "lecheria", name: "Lechería", state: "Anzoátegui" },
  { id: "barcelona", name: "Barcelona", state: "Anzoátegui" },
  { id: "maturin", name: "Maturín", state: "Monagas" },
  { id: "san-cristobal", name: "San Cristóbal", state: "Táchira" },
  { id: "ciudad-bolivar", name: "Ciudad Bolívar", state: "Bolívar" },
  { id: "porlamar", name: "Porlamar", state: "Nueva Esparta" },
  { id: "punto-fijo", name: "Punto Fijo", state: "Falcón" },
  { id: "cabimas", name: "Cabimas", state: "Zulia" },
];

export function cityName(id: CityId | string): string {
  return CITIES.find((c) => c.id === id)?.name ?? id;
}
