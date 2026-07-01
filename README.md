# Falmouth Sailing Decision Pack Web App

A static, self-contained web app for reviewing a Falmouth sailing decision pack.

## How to run

1. Unzip the folder.
2. Open `index.html` in any modern browser.
3. No server or internet connection is required for the charts and tables.

## How to update the forecast

Edit `data.js`. The app reads all forecast, wind, tide and pressure-card data from `window.SAILING_DATA`.

## Limitations

- The pressure-chart section links to the official Met Office chart page rather than scraping or embedding live chart images. This avoids fragile scraping/CORS issues.
- The tidal curve is interpolated from published high and low waters and is suitable for visual planning only.
- Refresh all marine sources before departure.
