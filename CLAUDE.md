# Weather App

Vanilla JS weather app using Open-Meteo APIs. Deployed to GitHub Pages at https://joesak.com/weather/

## Git Workflow

Pushing directly to `main` is fine for this project.

## Architecture

Static site (no build step). ES modules loaded directly by the browser.

- `js/app.js` - Entry point. Handles search, geolocation, URL history, unit toggle
- `js/api.js` - Open-Meteo forecast API (build URL, parse response, fetch)
- `js/geo.js` - Open-Meteo geocoding API (city/zip search)
- `js/ui.js` - DOM rendering (current weather, hourly/daily forecasts)
- `js/utils.js` - Temperature conversion, weather code mappings, date formatting
- `index.html` / `style.css` - Single page, no framework

## APIs

- Forecast: `https://api.open-meteo.com/v1/forecast` (no API key needed)
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search` (no API key needed)
- All temperatures fetched in Celsius, converted client-side for Fahrenheit

## Testing

```bash
npm test          # vitest run (single pass)
npm run test:watch # vitest watch mode
```

- Tests in `tests/` directory, using vitest + jsdom
- Pure functions are unit tested; DOM rendering tested with jsdom

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`:
1. Runs tests
2. Copies `index.html`, `style.css`, `js/` into `_site/`
3. Deploys to GitHub Pages (custom domain: joesak.com)
