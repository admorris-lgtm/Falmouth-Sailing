# Falmouth Sailing Decision Pack v5

This version is designed to draw fresh open data each time the page is opened.

## Live data

- Wind: Open-Meteo weather forecast, hourly, in knots.
- Model tide curve and model high/low estimates: Open-Meteo Marine API `sea_level_height_msl`.
- Sea state and model current summary: Open-Meteo Marine API wave/current variables.
- Tidal-stream atlas plates: static images stored in the repository and loaded from raw GitHub URLs.

## Important limitation

The live tide values are modelled sea-level height above mean sea level, not official tide-table heights above chart datum. They are useful for shape, trend and timing context, but not for navigation-critical clearance decisions. Use official EasyTide/UKHO, harbour information, MSI and your own judgment before sailing.

Official Met Office shipping forecast, inshore waters and pressure charts are linked rather than scraped because they do not provide a simple public no-key browser API suitable for a static GitHub Pages app.

## Upload to GitHub Pages

Upload/replace the contents of this folder at the repository root, including `.nojekyll`, then open:

```text
https://admorris-lgtm.github.io/Falmouth-Sailing/?v=5
```
