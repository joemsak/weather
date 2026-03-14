import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildGeocodingUrl,
  parseGeocodingResponse,
  searchLocation,
} from "../js/geo.js";

describe("buildGeocodingUrl", () => {
  it("builds URL with search query", () => {
    const url = buildGeocodingUrl("New York");
    expect(url).toContain("name=New+York");
    expect(url).toContain("count=5");
    expect(url).toContain("language=en");
  });

  it("encodes special characters", () => {
    const url = buildGeocodingUrl("São Paulo");
    expect(url).toContain("name=S");
  });
});

describe("parseGeocodingResponse", () => {
  it("parses results into location objects", () => {
    const mockResponse = {
      results: [
        {
          name: "New York",
          latitude: 40.7128,
          longitude: -74.006,
          country: "United States",
          admin1: "New York",
        },
      ],
    };

    const locations = parseGeocodingResponse(mockResponse);
    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual({
      name: "New York",
      lat: 40.7128,
      lng: -74.006,
      country: "United States",
      region: "New York",
      displayName: "New York, New York, United States",
    });
  });

  it("returns empty array when no results", () => {
    expect(parseGeocodingResponse({})).toEqual([]);
    expect(parseGeocodingResponse({ results: [] })).toEqual([]);
  });

  it("builds display name with region and country", () => {
    const mockResponse = {
      results: [
        {
          name: "Portland",
          latitude: 45.5,
          longitude: -122.6,
          country: "United States",
          admin1: "Oregon",
        },
      ],
    };
    const locations = parseGeocodingResponse(mockResponse);
    expect(locations[0].displayName).toBe("Portland, Oregon, United States");
  });
});

describe("searchLocation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and returns parsed locations", async () => {
    const mockData = {
      results: [
        {
          name: "London",
          latitude: 51.5,
          longitude: -0.1,
          country: "United Kingdom",
          admin1: "England",
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const locations = await searchLocation("London");
    expect(locations).toHaveLength(1);
    expect(locations[0].name).toBe("London");
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("returns empty array on failed fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    const locations = await searchLocation("Nowhere");
    expect(locations).toEqual([]);
  });
});
