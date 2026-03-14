const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export function buildGeocodingUrl(query) {
  const params = new URLSearchParams({
    name: query,
    count: 5,
    language: "en",
    format: "json",
  });
  return `${GEOCODING_URL}?${params}`;
}

export function parseGeocodingResponse(data) {
  if (!data.results || data.results.length === 0) {
    return [];
  }
  return data.results.map((r) => ({
    name: r.name,
    lat: r.latitude,
    lng: r.longitude,
    country: r.country,
    region: r.admin1,
    displayName: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
  }));
}

export async function searchLocation(query) {
  const url = buildGeocodingUrl(query);
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return parseGeocodingResponse(data);
}
