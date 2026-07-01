window.APP_CONFIG = {
  locationName: "Falmouth",
  lat: 50.1526,
  lon: -5.0663,
  notes: {
    liveData: "Wind, model tide height, model sea state and model ocean-current data are fetched fresh whenever the app opens.",
    navigationWarning: "Open-Meteo tide heights are modelled sea-level height above mean sea level, not official local tide-table heights above chart datum. Use official tide tables, MSI and harbour information for navigation-critical decisions."
  },
  pressureCharts: [
    { label: "Analysis", note: "Open official chart sequence and scroll from current analysis." },
    { label: "+12h", note: "Check isobar spacing and fronts over SW approaches." },
    { label: "+24h", note: "Check if pressure gradient is easing or tightening." },
    { label: "+36h", note: "Look for the next front or ridge." },
    { label: "+48h", note: "Confirm trend before relying on the next day." }
  ],
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
