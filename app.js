const config = window.APP_CONFIG;
const MET_OFFICE_PRESSURE = "https://weather.metoffice.gov.uk/maps-and-charts/surface-pressure";
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn&timezone=auto&forecast_days=3`;
const OPEN_METEO_MARINE_URL = `https://marine-api.open-meteo.com/v1/marine?latitude=${config.lat}&longitude=${config.lon}&hourly=sea_level_height_msl,wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction&timezone=auto&forecast_days=3&cell_selection=sea&velocity_unit=kn`;

const fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const today = new Date();
const tomorrow = addDays(today, 1);
const todayKey = dateKey(today);
const tomorrowKey = dateKey(tomorrow);

document.getElementById('dateLine').textContent = `${config.locationName} · ${fmtDay.format(today)} and ${fmtDay.format(tomorrow)}`;
document.getElementById('todayLabel').textContent = `Today · ${fmtDay.format(today)}`;
document.getElementById('tomorrowLabel').textContent = `Tomorrow · ${fmtDay.format(tomorrow)}`;

renderForecasts();
renderPressure();
renderStreams();
loadWind();
loadMarine();

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function hhmm(date) { return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
function degToCompass(num) {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(num / 22.5) % 16];
}
function safeNum(value) { return typeof value === 'number' && Number.isFinite(value); }
function round(value, dp = 1) { return safeNum(value) ? Number(value.toFixed(dp)) : null; }

function renderForecasts() {
  const root = document.getElementById('forecastCards');
  root.innerHTML = '';
  const ship = document.createElement('article');
  ship.className = 'forecast-card';
  ship.innerHTML = `<h3>Official marine text</h3>
    <p>The Met Office shipping forecast, inshore waters and pressure charts are official sources. This app opens those live sources rather than storing stale copied text.</p>
    <dl>
      <dt>Shipping area</dt><dd>Plymouth — open the Met Office shipping forecast button above.</dd>
      <dt>Inshore waters</dt><dd>Lyme Regis to Land’s End including Isles of Scilly — open the inshore waters button above.</dd>
      <dt>Pressure charts</dt><dd>Use the scrollable Met Office pressure-chart sequence below.</dd>
    </dl>`;
  root.appendChild(ship);

  const live = document.createElement('article');
  live.className = 'forecast-card';
  live.innerHTML = `<h3>Live model data used on this page</h3>
    <p>Hourly wind comes from Open-Meteo weather forecast data. Tide curve, model high/low waters, wave height and ocean-current figures come from the Open-Meteo Marine API and refresh every time the page opens.</p>
    <p class="muted">Model tide heights are sea level above mean sea level, not official local tide-table heights above chart datum. Do not use them for navigation-critical clearance decisions.</p>`;
  root.appendChild(live);
}

function renderPressure() {
  const strip = document.getElementById('pressureStrip');
  strip.innerHTML = '';
  config.pressureCharts.forEach(item => {
    const a = document.createElement('a');
    a.className = 'pressure-card';
    a.href = MET_OFFICE_PRESSURE;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.innerHTML = `<span>${item.label}</span><p class="muted">${item.note}</p>`;
    strip.appendChild(a);
  });
}

async function loadWind() {
  try {
    const res = await fetch(OPEN_METEO_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
    const json = await res.json();
    const rows = json.hourly.time.map((t, i) => ({
      time: new Date(t),
      mean: Math.round(json.hourly.wind_speed_10m[i]),
      gust: Math.round(json.hourly.wind_gusts_10m[i]),
      dirDeg: json.hourly.wind_direction_10m[i],
      dir: degToCompass(json.hourly.wind_direction_10m[i])
    }));
    const todayRows = rows.filter(r => dateKey(r.time) === todayKey);
    const tomorrowRows = rows.filter(r => dateKey(r.time) === tomorrowKey);
    renderWind(todayRows, 'windToday', 'windTableToday');
    renderWind(tomorrowRows, 'windTomorrow', 'windTableTomorrow');
    document.getElementById('windStatusToday').textContent = `Live wind loaded for ${config.locationName}.`;
    document.getElementById('windStatusTomorrow').textContent = `Live wind loaded for ${config.locationName}.`;
  } catch (err) {
    document.getElementById('windStatusToday').textContent = 'Live wind could not be loaded. Check your connection and refresh.';
    document.getElementById('windStatusTomorrow').textContent = 'Live wind could not be loaded. Check your connection and refresh.';
    renderWind([], 'windToday', 'windTableToday');
    renderWind([], 'windTomorrow', 'windTableTomorrow');
  }
}

async function loadMarine() {
  setTideLoading('tideTableToday', 'tideCurveToday');
  setTideLoading('tideTableTomorrow', 'tideCurveTomorrow');
  try {
    const res = await fetch(OPEN_METEO_MARINE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Open-Meteo Marine returned ${res.status}`);
    const json = await res.json();
    const rows = json.hourly.time.map((t, i) => ({
      time: new Date(t),
      height: round(json.hourly.sea_level_height_msl?.[i], 2),
      waveHeight: round(json.hourly.wave_height?.[i], 1),
      waveDirection: json.hourly.wave_direction?.[i],
      wavePeriod: round(json.hourly.wave_period?.[i], 1),
      currentVelocity: round(json.hourly.ocean_current_velocity?.[i], 2),
      currentDirection: json.hourly.ocean_current_direction?.[i]
    })).filter(r => safeNum(r.height));

    renderMarineDay(rows.filter(r => dateKey(r.time) === todayKey), 'tideTableToday', 'tideCurveToday');
    renderMarineDay(rows.filter(r => dateKey(r.time) === tomorrowKey), 'tideTableTomorrow', 'tideCurveTomorrow');
  } catch (err) {
    renderMarineError('tideTableToday', 'tideCurveToday');
    renderMarineError('tideTableTomorrow', 'tideCurveTomorrow');
  }
}

function setTideLoading(tableId, curveId) {
  document.getElementById(tableId).innerHTML = '<tbody><tr><td>Loading live model tide and sea-state data…</td></tr></tbody>';
  document.getElementById(curveId).innerHTML = '<p class="muted">Loading tidal curve…</p>';
}
function renderMarineError(tableId, curveId) {
  document.getElementById(tableId).innerHTML = '<tbody><tr><td>Live marine data could not be loaded. Refresh the page or use the official links above.</td></tr></tbody>';
  document.getElementById(curveId).innerHTML = '<p class="muted">No live tidal curve available.</p>';
}

function renderMarineDay(rows, tableId, curveId) {
  const table = document.getElementById(tableId);
  if (!rows.length) {
    renderMarineError(tableId, curveId);
    return;
  }
  const events = estimateTideEvents(rows);
  const eventsHtml = events.length
    ? events.map(e => `<tr><td>${hhmm(e.time)}</td><td>${e.type}</td><td>${e.height.toFixed(2)} m MSL</td></tr>`).join('')
    : '<tr><td colspan="3">No clear model high/low points found in the hourly data.</td></tr>';
  const seaSummary = summariseSea(rows);
  table.innerHTML = `<caption>Live model data. Tide height is sea-level height above mean sea level, not chart datum.</caption>
    <thead><tr><th>Time</th><th>Model tide</th><th>Height</th></tr></thead><tbody>${eventsHtml}</tbody>
    <thead><tr><th colspan="3">Sea state and current model summary</th></tr></thead>
    <tbody>${seaSummary}</tbody>`;
  drawTideCurveFromRows(document.getElementById(curveId), rows, events);
}

function summariseSea(rows) {
  const waveRows = rows.filter(r => safeNum(r.waveHeight));
  const currentRows = rows.filter(r => safeNum(r.currentVelocity));
  const maxWave = waveRows.reduce((a, r) => !a || r.waveHeight > a.waveHeight ? r : a, null);
  const maxCurrent = currentRows.reduce((a, r) => !a || r.currentVelocity > a.currentVelocity ? r : a, null);
  const avgWavePeriod = waveRows.length ? waveRows.reduce((s, r) => s + (r.wavePeriod || 0), 0) / waveRows.length : null;
  return `
    <tr><td>Max wave</td><td colspan="2">${maxWave ? `${maxWave.waveHeight.toFixed(1)} m at ${hhmm(maxWave.time)}, from ${degToCompass(maxWave.waveDirection)} (${Math.round(maxWave.waveDirection)}°)` : 'Not available'}</td></tr>
    <tr><td>Wave period</td><td colspan="2">${safeNum(avgWavePeriod) ? `${avgWavePeriod.toFixed(1)} s average` : 'Not available'}</td></tr>
    <tr><td>Max current</td><td colspan="2">${maxCurrent ? `${maxCurrent.currentVelocity.toFixed(2)} kt at ${hhmm(maxCurrent.time)}, setting ${degToCompass(maxCurrent.currentDirection)} (${Math.round(maxCurrent.currentDirection)}°)` : 'Not available'}</td></tr>`;
}

function estimateTideEvents(rows) {
  const events = [];
  for (let i = 1; i < rows.length - 1; i++) {
    const prev = rows[i - 1].height, cur = rows[i].height, next = rows[i + 1].height;
    if (cur >= prev && cur > next) events.push({ time: rows[i].time, type: 'Model high water', height: cur });
    if (cur <= prev && cur < next) events.push({ time: rows[i].time, type: 'Model low water', height: cur });
  }
  if (!events.length && rows.length) {
    const high = rows.reduce((a, r) => r.height > a.height ? r : a, rows[0]);
    const low = rows.reduce((a, r) => r.height < a.height ? r : a, rows[0]);
    events.push({ time: low.time, type: 'Model low water', height: low.height });
    events.push({ time: high.time, type: 'Model high water', height: high.height });
  }
  return events.sort((a, b) => a.time - b.time);
}

function renderWind(rows, canvasId, tableId) {
  const table = document.getElementById(tableId);
  table.innerHTML = '<thead><tr><th>Time</th><th>Mean</th><th>Gust</th><th>Direction</th></tr></thead><tbody>' +
    (rows.length ? rows.map(r => `<tr><td>${hhmm(r.time)}</td><td>${r.mean} kt</td><td>${r.gust} kt</td><td>${r.dir} (${Math.round(r.dirDeg)}°)</td></tr>`).join('') : '<tr><td colspan="4">No wind data loaded.</td></tr>') + '</tbody>';
  drawWindChart(document.getElementById(canvasId), rows);
}

function drawWindChart(canvas, rows) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.max(600, rect.width) * dpr;
  canvas.height = 260 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = canvas.width / dpr, h = canvas.height / dpr;
  ctx.clearRect(0,0,w,h);
  const pad = { l: 42, r: 16, t: 16, b: 34 };
  ctx.strokeStyle = '#dce6e7'; ctx.lineWidth = 1;
  ctx.font = '12px system-ui'; ctx.fillStyle = '#61717c';
  const max = Math.max(20, ...rows.map(r => r.gust + 2));
  for (let y = 0; y <= max; y += 5) {
    const py = h - pad.b - (y / max) * (h - pad.t - pad.b);
    ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(w - pad.r, py); ctx.stroke();
    ctx.fillText(`${y}`, 10, py + 4);
  }
  if (!rows.length) { ctx.fillText('No data', pad.l + 8, 70); return; }
  const x = i => pad.l + (i / Math.max(1, rows.length - 1)) * (w - pad.l - pad.r);
  const y = v => h - pad.b - (v / max) * (h - pad.t - pad.b);
  drawLine(ctx, rows.map((r,i) => [x(i), y(r.gust)]), '#8a5a00', 2.4);
  drawLine(ctx, rows.map((r,i) => [x(i), y(r.mean)]), '#075d78', 2.4);
  ctx.fillStyle = '#61717c';
  rows.forEach((r, i) => { if (i % 3 === 0) ctx.fillText(hhmm(r.time).slice(0,2), x(i)-6, h-10); });
  ctx.fillStyle = '#075d78'; ctx.fillText('Mean', w - 104, 20);
  ctx.fillStyle = '#8a5a00'; ctx.fillText('Gust', w - 58, 20);
}
function drawLine(ctx, points, color, width) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
}

function minutesFromDate(d) { return d.getHours() * 60 + d.getMinutes(); }
function heightAtRows(rows, min) {
  const points = rows.map(r => ({ m: minutesFromDate(r.time), h: r.height })).sort((a,b) => a.m-b.m);
  if (min <= points[0].m) return points[0].h;
  if (min >= points[points.length-1].m) return points[points.length-1].h;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i+1];
    if (min >= a.m && min <= b.m) {
      const t = (min - a.m) / (b.m - a.m || 1);
      return a.h + (b.h - a.h) * t;
    }
  }
  return points[0].h;
}
function drawTideCurveFromRows(root, rows, events) {
  const width = 720, height = 230, pad = {l: 42, r: 18, t: 18, b: 34};
  const samples = Array.from({length: 97}, (_, i) => ({m: i*15, h: heightAtRows(rows, i*15)}));
  const minH = Math.floor(Math.min(...samples.map(s => s.h)) * 10) / 10;
  const maxH = Math.ceil(Math.max(...samples.map(s => s.h)) * 10) / 10;
  const range = Math.max(0.2, maxH - minH);
  const x = m => pad.l + (m / 1440) * (width - pad.l - pad.r);
  const y = h => height - pad.b - ((h - minH) / range) * (height - pad.t - pad.b);
  const d = samples.map((s,i) => `${i?'L':'M'}${x(s.m).toFixed(1)},${y(s.h).toFixed(1)}`).join(' ');
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="230" role="img" aria-label="Interactive model tidal curve">
    <rect width="${width}" height="${height}" fill="#fbfdfd" />
    ${[0,6,12,18,24].map(hh => `<line x1="${x(hh*60)}" x2="${x(hh*60)}" y1="${pad.t}" y2="${height-pad.b}" stroke="#dce6e7"/><text x="${x(hh*60)}" y="${height-10}" text-anchor="middle" font-size="12" fill="#61717c">${String(hh).padStart(2,'0')}</text>`).join('')}
    ${Array.from({length: 6}, (_,i) => minH + i * (range / 5)).map(v => `<line x1="${pad.l}" x2="${width-pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="#eef3f4"/><text x="8" y="${y(v)+4}" font-size="11" fill="#61717c">${v.toFixed(2)}</text>`).join('')}
    <path d="${d}" fill="none" stroke="#075d78" stroke-width="4" stroke-linecap="round" />
    ${events.map(e => `<circle cx="${x(minutesFromDate(e.time))}" cy="${y(e.height)}" r="5" fill="#8a5a00"><title>${hhmm(e.time)} · ${e.type} · ${e.height.toFixed(2)} m MSL</title></circle>`).join('')}
    <line id="crosshair" x1="0" x2="0" y1="${pad.t}" y2="${height-pad.b}" stroke="#0d2230" stroke-width="1.4" opacity="0"/>
  </svg><div class="curve-tooltip" hidden></div>`;
  const svg = root.querySelector('svg');
  const tip = root.querySelector('.curve-tooltip');
  const line = root.querySelector('#crosshair');
  svg.addEventListener('pointermove', ev => {
    const box = svg.getBoundingClientRect();
    const pos = Math.min(Math.max(0, (ev.clientX - box.left) / box.width), 1);
    const m = Math.round(pos * 1440);
    const hgt = heightAtRows(rows, m);
    const sx = x(m);
    line.setAttribute('x1', sx); line.setAttribute('x2', sx); line.setAttribute('opacity','1');
    tip.hidden = false;
    tip.style.left = `${pos * 100}%`;
    tip.style.top = `${y(hgt) / height * 230}px`;
    tip.textContent = `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')} · ${hgt.toFixed(2)} m MSL`;
  });
  svg.addEventListener('pointerleave', () => { line.setAttribute('opacity','0'); tip.hidden = true; });
}

function renderStreams() {
  const controls = document.getElementById('streamControls');
  const gallery = document.getElementById('streamGallery');
  controls.innerHTML = '';
  gallery.innerHTML = '';
  config.streamCharts.forEach((c, i) => {
    const id = `stream-${i}`;
    const btn = document.createElement('button');
    btn.textContent = c.label;
    btn.addEventListener('click', () => document.getElementById(id).scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }));
    if (i === 0) btn.classList.add('active');
    controls.appendChild(btn);
    const card = document.createElement('article');
    card.className = 'stream-card';
    card.id = id;
    card.innerHTML = `<strong>${c.label}</strong><img src="${c.file}" alt="Tidal stream chart ${c.label}" loading="lazy"><p class="image-fallback" hidden>Chart did not load. <a href="${c.file}" target="_blank" rel="noreferrer">Open image directly</a></p>`;
    const img = card.querySelector('img');
    const fallback = card.querySelector('.image-fallback');
    img.addEventListener('error', () => { fallback.hidden = false; });
    gallery.appendChild(card);
  });
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(loadWind, 150);
});
