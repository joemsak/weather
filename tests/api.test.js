import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildForecastUrl,
  parseForecastResponse,
  fetchWeather,
} from "../js/api.js";

describe("buildForecastUrl", () => {
  it("builds URL with lat/lng and required params", () => {
    const url = buildForecastUrl(40.7128, -74.006);
    expect(url).toContain("latitude=40.7128");
    expect(url).toContain("longitude=-74.006");
    expect(url).toContain("current=");
    expect(url).toContain("hourly=");
    expect(url).toContain("daily=");
    expect(url).toContain("temperature_unit=celsius");
  });
});

describe("parseForecastResponse", () => {
  const mockResponse = {
    current: {
      temperature_2m: 22.5,
      apparent_temperature: 20.1,
      relative_humidity_2m: 65,
      wind_speed_10m: 12.3,
      weather_code: 2,
    },
    hourly: {
      time: ["2024-01-15T00:00", "2024-01-15T01:00", "2024-01-15T02:00"],
      temperature_2m: [18.0, 17.5, 17.0],
      weather_code: [0, 1, 2],
    },
    daily: {
      time: ["2024-01-15", "2024-01-16"],
      temperature_2m_max: [22.5, 24.0],
      temperature_2m_min: [15.0, 16.0],
      weather_code: [2, 3],
    },
  };

  it("parses current weather", () => {
    const result = parseForecastResponse(mockResponse);
    expect(result.current.temp).toBe(22.5);
    expect(result.current.feelsLike).toBe(20.1);
    expect(result.current.humidity).toBe(65);
    expect(result.current.windSpeed).toBe(12.3);
    expect(result.current.weatherCode).toBe(2);
  });

  it("parses hourly forecast", () => {
    const result = parseForecastResponse(mockResponse);
    expect(result.hourly).toHaveLength(3);
    expect(result.hourly[0]).toEqual({
      time: "2024-01-15T00:00",
      temp: 18.0,
      weatherCode: 0,
    });
  });

  it("parses daily forecast", () => {
    const result = parseForecastResponse(mockResponse);
    expect(result.daily).toHaveLength(2);
    expect(result.daily[0]).toEqual({
      date: "2024-01-15",
      tempMax: 22.5,
      tempMin: 15.0,
      weatherCode: 2,
    });
  });
});

describe("fetchWeather", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and parses weather data", async () => {
    const mockData = {
      current: {
        temperature_2m: 20,
        apparent_temperature: 18,
        relative_humidity_2m: 50,
        wind_speed_10m: 10,
        weather_code: 0,
      },
      hourly: { time: [], temperature_2m: [], weather_code: [] },
      daily: {
        time: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
        weather_code: [],
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchWeather(40.7, -74.0);
    expect(result.current.temp).toBe(20);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("throws on failed fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchWeather(40.7, -74.0)).rejects.toThrow(
      "Weather API error: 500",
    );
  });
});
