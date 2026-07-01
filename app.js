const config = window.APP_CONFIG;
const MET_OFFICE_PRESSURE = "https://weather.metoffice.gov.uk/maps-and-charts/surface-pressure";
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn&timezone=auto&forecast_days=3`;

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
renderTides('today', config.tides.today, 'tideTableToday', 'tideCurveToday');
renderTides('tomorrow', config.tides.tomorrow, 'tideTableTomorrow', 'tideCurveTomorrow');
renderStreams();
loadWind();

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function dateKey(date) { return date.toISOString().slice(0, 10); }
function hhmm(date) { return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
function degToCompass(num) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(num / 22.5) % 16];
}

function renderForecasts() {
  const root = document.getElementById('forecastCards');
  const ship = document.createElement('article');
  ship.className = 'forecast-card';
  ship.innerHTML = `<h3>Shipping forecast — ${config.shipping.area}</h3><p class="muted">Issued: ${config.shipping.issued}<br>Valid: ${config.shipping.valid}</p><dl>${config.shipping.rows.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  root.appendChild(ship);
  config.inshore.forEach(item => {
    const el = document.createElement('article');
    el.className = 'forecast-card';
    el.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    root.appendChild(el);
  });
}

function renderPressure() {
  const strip = document.getElementById('pressureStrip');
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
    document.getElementById('windStatusToday').textContent = `Live wind loaded from Open-Meteo for ${config.locationName}. Check official marine forecasts before departure.`;
    document.getElementById('windStatusTomorrow').textContent = `Live wind loaded from Open-Meteo for ${config.locationName}. Check official marine forecasts before departure.`;
  } catch (err) {
    document.getElementById('windStatusToday').textContent = 'Live wind could not be loaded. Check your internet connection or refresh.';
    document.getElementById('windStatusTomorrow').textContent = 'Live wind could not be loaded. Check your internet connection or refresh.';
    renderWind([], 'windToday', 'windTableToday');
    renderWind([], 'windTomorrow', 'windTableTomorrow');
  }
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
  ctx.scale(dpr, dpr);
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

function renderTides(day, events, tableId, curveId) {
  const table = document.getElementById(tableId);
  table.innerHTML = '<thead><tr><th>Time</th><th>Tide</th><th>Height</th></tr></thead><tbody>' +
    events.map(e => `<tr><td>${e.time}</td><td>${e.type}</td><td>${e.height.toFixed(2)} m</td></tr>`).join('') + '</tbody>';
  drawTideCurve(document.getElementById(curveId), events);
}

function minutes(t) { const [h,m] = t.split(':').map(Number); return h*60 + m; }
function tideHeightAt(events, min) {
  const points = events.map(e => ({ m: minutes(e.time), h: e.height }));
  while (points[0].m > 0) points.unshift({ m: points[0].m - 6*60 - 12, h: points[0].h });
  while (points[points.length-1].m < 1440) points.push({ m: points[points.length-1].m + 6*60 + 12, h: points[points.length-1].h });
  let a = points[0], b = points[1];
  for (let i=0; i<points.length-1; i++) if (min >= points[i].m && min <= points[i+1].m) { a=points[i]; b=points[i+1]; break; }
  const t = (min - a.m) / (b.m - a.m);
  const eased = (1 - Math.cos(Math.PI * t)) / 2;
  return a.h + (b.h - a.h) * eased;
}
function drawTideCurve(root, events) {
  const width = 720, height = 230, pad = {l: 42, r: 18, t: 18, b: 34};
  const samples = Array.from({length: 97}, (_, i) => ({m: i*15, h: tideHeightAt(events, i*15)}));
  const minH = Math.floor(Math.min(...samples.map(s => s.h)) * 2) / 2;
  const maxH = Math.ceil(Math.max(...samples.map(s => s.h)) * 2) / 2;
  const x = m => pad.l + (m / 1440) * (width - pad.l - pad.r);
  const y = h => height - pad.b - ((h - minH) / (maxH - minH || 1)) * (height - pad.t - pad.b);
  const d = samples.map((s,i) => `${i?'L':'M'}${x(s.m).toFixed(1)},${y(s.h).toFixed(1)}`).join(' ');
  root.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="230" role="img" aria-label="Interactive tidal curve">
    <rect width="${width}" height="${height}" fill="#fbfdfd" />
    ${[0,6,12,18,24].map(hh => `<line x1="${x(hh*60)}" x2="${x(hh*60)}" y1="${pad.t}" y2="${height-pad.b}" stroke="#dce6e7"/><text x="${x(hh*60)}" y="${height-10}" text-anchor="middle" font-size="12" fill="#61717c">${String(hh).padStart(2,'0')}</text>`).join('')}
    ${Array.from({length: Math.floor((maxH-minH)/.5)+1}, (_,i) => minH+i*.5).map(v => `<line x1="${pad.l}" x2="${width-pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="#eef3f4"/><text x="12" y="${y(v)+4}" font-size="11" fill="#61717c">${v.toFixed(1)}</text>`).join('')}
    <path d="${d}" fill="none" stroke="#075d78" stroke-width="4" stroke-linecap="round" />
    ${events.map(e => `<circle cx="${x(minutes(e.time))}" cy="${y(e.height)}" r="5" fill="#8a5a00"><title>${e.time} · ${e.type} · ${e.height.toFixed(2)} m</title></circle>`).join('')}
    <line id="crosshair" x1="0" x2="0" y1="${pad.t}" y2="${height-pad.b}" stroke="#0d2230" stroke-width="1.4" opacity="0"/>
  </svg><div class="curve-tooltip" hidden></div>`;
  const svg = root.querySelector('svg');
  const tip = root.querySelector('.curve-tooltip');
  const line = root.querySelector('#crosshair');
  svg.addEventListener('pointermove', ev => {
    const box = svg.getBoundingClientRect();
    const pos = Math.min(Math.max(0, (ev.clientX - box.left) / box.width), 1);
    const m = Math.round(pos * 1440);
    const hgt = tideHeightAt(events, m);
    const sx = x(m);
    line.setAttribute('x1', sx); line.setAttribute('x2', sx); line.setAttribute('opacity','1');
    tip.hidden = false;
    tip.style.left = `${pos * 100}%`;
    tip.style.top = `${y(hgt) / height * 230}px`;
    tip.textContent = `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')} · ${hgt.toFixed(2)} m`;
  });
  svg.addEventListener('pointerleave', () => { line.setAttribute('opacity','0'); tip.hidden = true; });
}

function renderStreams() {
  const controls = document.getElementById('streamControls');
  const gallery = document.getElementById('streamGallery');
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
    card.innerHTML = `<strong>${c.label}</strong><img src="${c.file}" alt="Tidal stream chart ${c.label}">`;
    gallery.appendChild(card);
  });
}


window.addEventListener('resize', () => loadWind());
