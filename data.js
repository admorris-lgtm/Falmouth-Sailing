window.APP_CONFIG = {
  locationName: "Falmouth",
  lat: 50.1526,
  lon: -5.0663,
  fallbackIssued: "Edit this in data.js after checking official sources",
  shipping: {
    area: "Plymouth",
    issued: "Manual fallback — replace with the latest Met Office issue time",
    valid: "Manual fallback — replace with the latest validity period",
    rows: [
      ["Wind", "Replace with latest Plymouth shipping forecast."],
      ["Sea state", "Replace with latest Plymouth sea-state forecast."],
      ["Weather", "Replace with latest Plymouth weather text."],
      ["Visibility", "Replace with latest Plymouth visibility text."]
    ]
  },
  inshore: [
    { title: "Lyme Regis to Land’s End including Isles of Scilly", text: "Replace with the latest Met Office inshore waters forecast." }
  ],
  pressureCharts: [
    { label: "Analysis", note: "Open official chart sequence and scroll from current analysis." },
    { label: "+12h", note: "Check isobar spacing and fronts over SW approaches." },
    { label: "+24h", note: "Check if pressure gradient is easing or tightening." },
    { label: "+36h", note: "Look for the next front or ridge." },
    { label: "+48h", note: "Confirm trend before relying on the next day." }
  ],
  // Replace these tide values each morning from EasyTide or your preferred official tide table.
  // The app changes the labels to today/tomorrow automatically, but official tide times do not auto-fetch from this static app.
  tides: {
    today: [
      { time: "01:46", type: "Low water", height: 1.10 },
      { time: "07:36", type: "High water", height: 4.60 },
      { time: "13:58", type: "Low water", height: 1.10 },
      { time: "19:46", type: "High water", height: 4.80 }
    ],
    tomorrow: [
      { time: "02:38", type: "Low water", height: 1.20 },
      { time: "08:31", type: "High water", height: 4.50 },
      { time: "14:50", type: "Low water", height: 1.20 },
      { time: "20:42", type: "High water", height: 4.70 }
    ]
  },
  streamCharts: [
    { label: "5 before HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/05-before-hw-devonport.png" },
    { label: "3 before HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/03-before-hw-devonport.png" },
    { label: "1 before HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/01-before-hw-devonport.png" },
    { label: "High water Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/00-high-water-devonport.png" },
    { label: "1 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/01-after-hw-devonport.png" },
    { label: "2 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/02-after-hw-devonport.png" },
    { label: "3 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/03-after-hw-devonport.png" },
    { label: "4 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/04-after-hw-devonport.png" },
    { label: "5 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/05-after-hw-devonport.png" },
    { label: "6 after HW Devonport", file: "https://raw.githubusercontent.com/admorris-lgtm/Falmouth-Sailing/main/assets/tidal-streams/06-after-hw-devonport.png" }
  ]
};
