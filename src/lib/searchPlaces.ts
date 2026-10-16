export type Place = {
  name: string;
  city?: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
};

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  if (!query || query.length < 2) return [];

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Erro ao buscar lugares");

  const data = await response.json();

  return data.features.map((f: {
    properties: {
      name: string;
      city?: string;
      state?: string;
      country: string;
    };
    geometry: { coordinates: [number, number] };
  }) => ({
    name: f.properties.name,
    city: f.properties.city,
    state: f.properties.state,
    country: f.properties.country,
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
  }));
}