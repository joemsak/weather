import {
  formatTemp,
  weatherCodeToDescription,
  weatherCodeToIcon,
  formatHour,
  formatDay,
} from "./utils.js";

function formatDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

export function renderCurrentWeather(container, data, unit, locationName) {
  const { temp, feelsLike, humidity, windSpeed, weatherCode } = data.current;
  container.innerHTML = `
    <div class="current-weather">
      <div class="location-name">${locationName}</div>
      <div class="current-datetime">${formatDateTime()}</div>
      <div class="current-icon">${weatherCodeToIcon(weatherCode)}</div>
      <div class="current-temp">${formatTemp(temp, unit)}</div>
      <div class="current-condition">${weatherCodeToDescription(weatherCode)}</div>
      <div class="current-details">
        <span class="feels-like">Feels like ${formatTemp(feelsLike, unit)}</span>
        <span class="humidity">Humidity ${humidity}%</span>
        <span class="wind">Wind ${windSpeed} km/h</span>
      </div>
    </div>
  `;
}

export function renderHourlyForecast(
  container,
  hourly,
  unit,
  now = new Date(),
) {
  const currentHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
  ).getTime();
  const items = hourly
    .filter((h) => new Date(h.time).getTime() >= currentHour)
    .slice(0, 24);
  container.innerHTML = `
    <h2>Hourly</h2>
    <div class="hourly-scroll">
      ${items
        .map(
          (h) => `
        <div class="hourly-item">
          <div class="hourly-time">${formatHour(h.time)}</div>
          <div class="hourly-icon">${weatherCodeToIcon(h.weatherCode)}</div>
          <div class="hourly-temp">${formatTemp(h.temp, unit)}</div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

export function renderDailyForecast(container, daily, unit) {
  container.innerHTML = `
    <h2>5-Day Forecast</h2>
    <div class="daily-list">
      ${daily
        .map(
          (d) => `
        <div class="daily-row">
          <span class="daily-day">${formatDay(d.date)}</span>
          <span class="daily-icon">${weatherCodeToIcon(d.weatherCode)}</span>
          <span class="daily-high">${formatTemp(d.tempMax, unit)}</span>
          <span class="daily-low">${formatTemp(d.tempMin, unit)}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

export function renderError(container, message) {
  container.innerHTML = `<div class="error-message">${message}</div>`;
}

export function renderLoading(container) {
  container.innerHTML = `<div class="loading">Loading weather data...</div>`;
}
