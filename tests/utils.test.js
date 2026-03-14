import { describe, it, expect } from "vitest";
import {
  celsiusToFahrenheit,
  formatTemp,
  weatherCodeToDescription,
  weatherCodeToIcon,
  formatHour,
  formatDay,
} from "../js/utils.js";

describe("celsiusToFahrenheit", () => {
  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("converts 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("converts negative temperatures", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });
});

describe("formatTemp", () => {
  it("rounds and appends °C for celsius", () => {
    expect(formatTemp(23.7, "C")).toBe("24°C");
  });

  it("converts and appends °F for fahrenheit", () => {
    expect(formatTemp(0, "F")).toBe("32°F");
  });

  it("rounds fahrenheit result", () => {
    expect(formatTemp(23.7, "F")).toBe("75°F");
  });
});

describe("weatherCodeToDescription", () => {
  it("returns Clear sky for code 0", () => {
    expect(weatherCodeToDescription(0)).toBe("Clear sky");
  });

  it("returns Rain for code 61", () => {
    expect(weatherCodeToDescription(61)).toBe("Light rain");
  });

  it("returns Snow for code 71", () => {
    expect(weatherCodeToDescription(71)).toBe("Light snow");
  });

  it("returns Unknown for unmapped codes", () => {
    expect(weatherCodeToDescription(999)).toBe("Unknown");
  });
});

describe("weatherCodeToIcon", () => {
  it("returns sun icon for clear sky", () => {
    expect(weatherCodeToIcon(0)).toBe("☀️");
  });

  it("returns cloud icon for overcast", () => {
    expect(weatherCodeToIcon(3)).toBe("☁️");
  });

  it("returns rain icon for rain codes", () => {
    expect(weatherCodeToIcon(61)).toBe("🌧️");
  });

  it("returns snow icon for snow codes", () => {
    expect(weatherCodeToIcon(71)).toBe("🌨️");
  });
});

describe("formatHour", () => {
  it("formats ISO string to hour like 3 PM", () => {
    expect(formatHour("2024-01-15T15:00")).toBe("3 PM");
  });

  it("formats midnight as 12 AM", () => {
    expect(formatHour("2024-01-15T00:00")).toBe("12 AM");
  });

  it("formats noon as 12 PM", () => {
    expect(formatHour("2024-01-15T12:00")).toBe("12 PM");
  });
});

describe("formatDay", () => {
  it("formats ISO date string to day name", () => {
    const result = formatDay("2024-01-15");
    expect(result).toBe("Mon");
  });

  it("formats another day", () => {
    const result = formatDay("2024-01-17");
    expect(result).toBe("Wed");
  });
});
