import { fetchWeather } from "./api.js";
import { searchLocation } from "./geo.js";
import {
  renderCurrentWeather,
  renderHourlyForecast,
  renderDailyForecast,
  renderError,
  renderLoading,
} from "./ui.js";

let currentUnit = "C";
let currentData = null;
let currentLocationName = "";

const currentEl = document.getElementById("current");
const hourlyEl = document.getElementById("hourly");
const dailyEl = document.getElementById("daily");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const unitF = document.getElementById("unit-f");
const unitC = document.getElementById("unit-c");

function renderAll() {
  if (!currentData) return;
  renderCurrentWeather(
    currentEl,
    currentData,
    currentUnit,
    currentLocationName,
  );
  renderHourlyForecast(hourlyEl, currentData.hourly, currentUnit);
  renderDailyForecast(dailyEl, currentData.daily, currentUnit);
}

function showLoading() {
  renderLoading(currentEl);
  hourlyEl.innerHTML = "";
  dailyEl.innerHTML = "";
}

function showError(msg) {
  renderError(currentEl, msg);
  hourlyEl.innerHTML = "";
  dailyEl.innerHTML = "";
}

async function loadWeather(lat, lng, name) {
  showLoading();
  try {
    currentData = await fetchWeather(lat, lng);
    currentLocationName = name;
    renderAll();
  } catch {
    showError("Failed to load weather data. Please try again.");
  }
}

async function handleSearch(query, { pushState = true } = {}) {
  if (!query) query = searchInput.value.trim();
  if (!query) return;

  showLoading();
  try {
    const locations = await searchLocation(query);
    if (locations.length === 0) {
      showError("Location not found. Try a different search.");
      return;
    }
    const loc = locations[0];
    await loadWeather(loc.lat, loc.lng, loc.displayName);
    searchInput.value = query;
    if (pushState) {
      const url = new URL(window.location);
      url.searchParams.set("q", query);
      history.pushState({ query }, "", url);
    }
  } catch {
    showError("Search failed. Please try again.");
  }
}

function setUnit(unit) {
  currentUnit = unit;
  unitF.classList.toggle("active", unit === "F");
  unitC.classList.toggle("active", unit === "C");
  renderAll();
}

searchBtn.addEventListener("click", () => handleSearch());
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
window.addEventListener("popstate", (e) => {
  const query =
    e.state?.query || new URL(window.location).searchParams.get("q");
  if (query) {
    handleSearch(query, { pushState: false });
  }
});
unitF.addEventListener("click", () => setUnit("F"));
unitC.addEventListener("click", () => setUnit("C"));

// On load: check URL params first, then try geolocation
const initialQuery = new URL(window.location).searchParams.get("q");
if (initialQuery) {
  handleSearch(initialQuery, { pushState: false });
} else if ("geolocation" in navigator) {
  showLoading();
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await loadWeather(latitude, longitude, "Your Location");
    },
    (err) => {
      if (err.code === 1) {
        showError(
          "Location access denied. Search for a city or zip code above.",
        );
      } else if (err.code === 3) {
        showError(
          "Location request timed out. Search for a city or zip code above.",
        );
      } else {
        showError(
          "Could not determine your location. Search for a city or zip code above.",
        );
      }
    },
    { enableHighAccuracy: false, timeout: 10000 },
  );
} else {
  showError("Search for a city or zip code above to see weather.");
}
