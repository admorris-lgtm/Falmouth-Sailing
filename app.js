const data = window.SAILING_DATA;

function renderTextSections() {
  const sf = document.getElementById('shippingForecast');
  data.shipping.rows.forEach(([key, value]) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<dt>${key}</dt><dd>${value}</dd>`;
    sf.appendChild(wrap);
  });

  const ins = document.getElementById('inshoreForecast');
  data.inshore.forEach(item => {
    const card = document.createElement('div');
    card.className = 'inshore-card';
    card.innerHTML = `<strong>${item.title}</strong><p>${item.text}</p>`;
    ins.appendChild(card);
  });

  const strip = document.getElementById('pressureStrip');
  data.pressureCharts.forEach(item => {
    const card = document.createElement('a');
    card.className = 'pressure-card';
    card.href = 'https://weather.metoffice.gov.uk/maps-and-charts/surface-pressure';
    card.target = '_blank';
    card.rel = 'noreferrer';
    card.role = 'listitem';
    card.innerHTML = `<span>${item.label}</span><p>${item.note}</p>`;
    strip.appendChild(card);
  });

  const tideBody = document.getElementById('tideTable');
  data.tides.forEach(tide => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${tide.time}</td><td>${tide.type}</td><td>${tide.height.toFixed(2)} m</td>`;
    tideBody.appendChild(row);
  });
  const high = data.tides.filter(t => t.type.includes('High'));
  const low = data.tides.filter(t => t.type.includes('Low'));
  document.getElementById('tideSummary').textContent = `Range approx. ${(Math.max(...high.map(t=>t.height)) - Math.min(...low.map(t=>t.height))).toFixed(1)} m. High water is close to the 07:00–09:30 departure window.`;
}

function drawChart(canvas, series, options) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || canvas.width;
  const cssHeight = Math.round(cssWidth * (canvas.height / canvas.width));
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  ctx.scale(dpr, dpr);

  const W = cssWidth, H = cssHeight;
  const pad = { left: 48, right: 22, top: 28, bottom: 48 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const maxY = options.maxY ?? Math.ceil(Math.max(...series.flatMap(s => s.values.map(v => v.y))) / 5) * 5;
  const minY = options.minY ?? 0;

  ctx.clearRect(0, 0, W, H);
  ctx.font = '12px system-ui, sans-serif';
  ctx.strokeStyle = '#d9d3c7';
  ctx.fillStyle = '#5c6b76';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = pad.top + plotH - (i / 5) * plotH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    const label = (minY + (maxY - minY) * i / 5).toFixed(options.decimals ?? 0);
    ctx.fillText(label, 10, y + 4);
  }

  const points = series[0].values;
  const xAt = i => pad.left + (i / (points.length - 1)) * plotW;
  const yAt = val => pad.top + plotH - ((val - minY) / (maxY - minY)) * plotH;

  points.forEach((p, i) => {
    if (i % options.labelStep === 0 || i === points.length - 1) {
      ctx.save();
      ctx.translate(xAt(i), H - 16);
      ctx.rotate(-Math.PI / 6);
      ctx.fillStyle = '#5c6b76';
      ctx.fillText(p.x, -12, 0);
      ctx.restore();
    }
  });

  series.forEach(s => {
    ctx.beginPath();
    s.values.forEach((p, i) => {
      const x = xAt(i), y = yAt(p.y);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    s.values.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(xAt(i), yAt(p.y), 3, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill();
    });
  });

  return { xAt, yAt, pad, plotW, plotH, W, H, minY, maxY };
}

function renderCharts() {
  const windCanvas = document.getElementById('windChart');
  drawChart(windCanvas, [
    { name: 'Mean', color: '#0c5a7a', values: data.wind.map(w => ({ x: w.time, y: w.mean })) },
    { name: 'Gust', color: '#c56b2d', values: data.wind.map(w => ({ x: w.time, y: w.gust })) }
  ], { maxY: 30, minY: 0, labelStep: 3 });

  const tideCanvas = document.getElementById('tideChart');
  const state = drawChart(tideCanvas, [
    { name: 'Tide', color: '#0c5a7a', values: data.tideCurve.map(t => ({ x: t.time, y: t.height })) }
  ], { maxY: 5, minY: 0, decimals: 1, labelStep: 2 });

  const tooltip = document.getElementById('tooltip');
  tideCanvas.onpointermove = (event) => {
    const rect = tideCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const index = Math.round((x - state.pad.left) / state.plotW * (data.tideCurve.length - 1));
    if (index < 0 || index >= data.tideCurve.length) { tooltip.hidden = true; return; }
    const p = data.tideCurve[index];
    const px = state.xAt(index), py = state.yAt(p.height);
    tooltip.hidden = false;
    tooltip.style.left = `${px}px`;
    tooltip.style.top = `${py}px`;
    tooltip.textContent = `${p.time} · ${p.height.toFixed(2)} m`;
  };
  tideCanvas.onpointerleave = () => tooltip.hidden = true;
}

renderTextSections();
renderCharts();
window.addEventListener('resize', renderCharts);
