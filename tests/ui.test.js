import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  renderCurrentWeather,
  renderHourlyForecast,
  renderDailyForecast,
  renderError,
  renderLoading,
} from "../js/ui.js";

describe("renderCurrentWeather", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("renders temperature and condition", () => {
    renderCurrentWeather(
      container,
      {
        current: {
          temp: 22.5,
          feelsLike: 20.1,
          humidity: 65,
          windSpeed: 12.3,
          weatherCode: 0,
        },
      },
      "C",
      "New York",
    );

    expect(container.querySelector(".current-temp").textContent).toBe("23°C");
    expect(container.querySelector(".current-condition").textContent).toBe(
      "Clear sky",
    );
    expect(container.querySelector(".current-icon").textContent).toBe("☀️");
    expect(container.querySelector(".location-name").textContent).toBe(
      "New York",
    );
  });

  it("renders current date and time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T14:30:00"));

    renderCurrentWeather(
      container,
      {
        current: {
          temp: 20,
          feelsLike: 18,
          humidity: 50,
          windSpeed: 10,
          weatherCode: 0,
        },
      },
      "C",
      "Test City",
    );

    const datetime = container.querySelector(".current-datetime").textContent;
    expect(datetime).toContain("Wednesday");
    expect(datetime).toContain("April");
    expect(datetime).toContain("1");
    expect(datetime).toContain("2:30");
    expect(datetime).toContain("PM");
    expect(datetime).not.toContain("2026");

    vi.useRealTimers();
  });

  it("renders in fahrenheit when unit is F", () => {
    renderCurrentWeather(
      container,
      {
        current: {
          temp: 0,
          feelsLike: -2,
          humidity: 50,
          windSpeed: 10,
          weatherCode: 0,
        },
      },
      "F",
      "Test City",
    );

    expect(container.querySelector(".current-temp").textContent).toBe("32°F");
  });

  it("renders details (feels like, humidity, wind)", () => {
    renderCurrentWeather(
      container,
      {
        current: {
          temp: 20,
          feelsLike: 18,
          humidity: 55,
          windSpeed: 15,
          weatherCode: 1,
        },
      },
      "C",
      "Test",
    );

    expect(container.querySelector(".feels-like").textContent).toContain(
      "18°C",
    );
    expect(container.querySelector(".humidity").textContent).toContain("55%");
    expect(container.querySelector(".wind").textContent).toContain("15");
  });
});

describe("renderHourlyForecast", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("renders hourly items", () => {
    const hourly = [
      { time: "2024-01-15T14:00", temp: 20, weatherCode: 0 },
      { time: "2024-01-15T15:00", temp: 21, weatherCode: 1 },
    ];

    renderHourlyForecast(container, hourly, "C", new Date("2024-01-15T13:00"));

    const items = container.querySelectorAll(".hourly-item");
    expect(items).toHaveLength(2);
    expect(items[0].querySelector(".hourly-temp").textContent).toBe("20°C");
    expect(items[0].querySelector(".hourly-icon").textContent).toBe("☀️");
  });

  it("limits to 24 items", () => {
    const hourly = Array.from({ length: 48 }, (_, i) => ({
      time: `2024-01-15T${String(i % 24).padStart(2, "0")}:00`,
      temp: 20,
      weatherCode: 0,
    }));

    renderHourlyForecast(container, hourly, "C", new Date("2024-01-15T00:00"));

    const items = container.querySelectorAll(".hourly-item");
    expect(items).toHaveLength(24);
  });

  it("filters out past hours", () => {
    const now = new Date("2024-01-15T14:30");
    const hourly = [
      { time: "2024-01-15T12:00", temp: 18, weatherCode: 0 },
      { time: "2024-01-15T13:00", temp: 19, weatherCode: 0 },
      { time: "2024-01-15T14:00", temp: 20, weatherCode: 0 },
      { time: "2024-01-15T15:00", temp: 21, weatherCode: 1 },
      { time: "2024-01-15T16:00", temp: 22, weatherCode: 2 },
    ];

    renderHourlyForecast(container, hourly, "C", now);

    const items = container.querySelectorAll(".hourly-item");
    expect(items).toHaveLength(3);
    expect(items[0].querySelector(".hourly-temp").textContent).toBe("20°C");
  });
});

describe("renderDailyForecast", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("renders daily rows with high/low", () => {
    const daily = [
      { date: "2024-01-15", tempMax: 22, tempMin: 15, weatherCode: 2 },
      { date: "2024-01-16", tempMax: 24, tempMin: 16, weatherCode: 3 },
    ];

    renderDailyForecast(container, daily, "C");

    const rows = container.querySelectorAll(".daily-row");
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector(".daily-high").textContent).toBe("22°C");
    expect(rows[0].querySelector(".daily-low").textContent).toBe("15°C");
    expect(rows[0].querySelector(".daily-icon").textContent).toBe("⛅");
  });
});

describe("renderError", () => {
  it("renders error message", () => {
    const container = document.createElement("div");
    renderError(container, "Location not found");
    expect(container.querySelector(".error-message").textContent).toBe(
      "Location not found",
    );
  });
});

describe("renderLoading", () => {
  it("renders loading indicator", () => {
    const container = document.createElement("div");
    renderLoading(container);
    expect(container.querySelector(".loading")).toBeTruthy();
  });
});
