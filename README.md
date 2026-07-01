# Falmouth Sailing Decision Pack v3

A static GitHub Pages app for Falmouth sailing planning.

## What changed

- Today and tomorrow are shown as two separate visible sections, and the labels update automatically every day.
- Hourly wind attempts to load live from Open-Meteo in knots for Falmouth.
- Tide sections show today and tomorrow separately.
- The tidal curve is interactive: hover/tap the curve to see time and height.
- The tidal-stream atlas images added in the chat are included as a scrollable gallery.
- Official source buttons are included for Met Office shipping forecast, inshore waters, pressure charts and ADMIRALTY EasyTide.

## Important limitation

GitHub Pages is static. It cannot safely fetch or scrape the latest official Met Office marine text, ADMIRALTY EasyTide tide tables, or Met Office pressure-chart images directly in the browser. Those services either do not expose a simple public no-key browser API or may block cross-origin browser requests.

The app therefore:

1. fetches live wind from Open-Meteo as a planning aid;
2. links directly to official Met Office / EasyTide sources;
3. keeps official tide and forecast fallback data in `data.js`, which you can update manually.

If you want fully automatic official-source refreshes, the next step is to move from GitHub Pages to a small backend/proxy, for example Netlify Functions, Cloudflare Workers, or a server app.

## Updating on GitHub

Upload/replace these files at the top level of your repository:

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- the `assets` folder
- `README.md`

Do not upload the ZIP itself.

## Daily manual update

Edit `data.js`:

- `shipping`
- `inshore`
- `tides.today`
- `tides.tomorrow`

The app will automatically label those entries as today and tomorrow.
