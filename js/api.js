const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export function buildForecastUrl(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    hourly: "temperature_2m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    forecast_days: "5",
    timezone: "auto",
  });
  return `${BASE_URL}?${params}`;
}

export function parseForecastResponse(data) {
  return {
    current: {
      temp: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    },
    hourly: data.hourly.time.map((time, i) => ({
      time,
      temp: data.hourly.temperature_2m[i],
      weatherCode: data.hourly.weather_code[i],
    })),
    daily: data.daily.time.map((date, i) => ({
      date,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
    })),
  };
}

export async function fetchWeather(lat, lng) {
  const url = buildForecastUrl(lat, lng);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  const data = await response.json();
  return parseForecastResponse(data);
}
