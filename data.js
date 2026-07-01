window.SAILING_DATA = {
  shipping: {
    area: "Plymouth",
    issued: "04:05 UTC+1, Wed 1 Jul 2026",
    valid: "06:00 Wed 1 Jul to 06:00 Thu 2 Jul",
    rows: [
      ["Wind", "West or northwest 3 or 4, backing west or southwest 4 to 6"],
      ["Sea state", "Smooth or slight, becoming slight or moderate"],
      ["Weather", "Rain or drizzle for a time later"],
      ["Visibility", "Good, occasionally poor later"]
    ]
  },
  inshore: [
    {
      title: "24-hour forecast",
      text: "West or northwest 3 to 5, occasionally 6 later. Slight or moderate, but rough at first in far west. Occasional rain later. Good, becoming moderate or good later."
    },
    {
      title: "Following 24 hours",
      text: "West or northwest 4 to 6, backing north or northwest 3 or 4, becoming variable 2 or 3 later. Slight or moderate, becoming smooth or slight later in Lyme Bay. Occasional rain at first. Moderate or good."
    }
  ],
  pressureCharts: [
    { label: "Analysis", note: "Start with current low, fronts and isobar spacing." },
    { label: "+12h", note: "Watch whether frontal rain is still over Cornwall." },
    { label: "+24h", note: "Look for easing gradient over SW approaches." },
    { label: "+36h", note: "Check if ridging is building from the west." },
    { label: "+48h", note: "Confirm the broader trend and next system." }
  ],
  wind: [
    { time: "00:00", mean: 10, gust: 25, dir: "WSW" },
    { time: "01:00", mean: 10, gust: 25, dir: "WSW" },
    { time: "02:00", mean: 10, gust: 25, dir: "W" },
    { time: "03:00", mean: 10, gust: 24, dir: "W" },
    { time: "04:00", mean: 10, gust: 24, dir: "W" },
    { time: "05:00", mean: 11, gust: 23, dir: "W" },
    { time: "06:00", mean: 10, gust: 23, dir: "W" },
    { time: "07:00", mean: 10, gust: 22, dir: "WNW" },
    { time: "08:00", mean: 10, gust: 21, dir: "WNW" },
    { time: "09:00", mean: 10, gust: 21, dir: "WNW" },
    { time: "10:00", mean: 10, gust: 19, dir: "WNW" },
    { time: "11:00", mean: 10, gust: 18, dir: "NW" },
    { time: "12:00", mean: 10, gust: 18, dir: "NW" },
    { time: "13:00", mean: 10, gust: 17, dir: "NW" },
    { time: "14:00", mean: 9, gust: 17, dir: "NW" },
    { time: "15:00", mean: 10, gust: 17, dir: "NW" },
    { time: "16:00", mean: 10, gust: 17, dir: "NW" },
    { time: "17:00", mean: 9, gust: 17, dir: "NNW" },
    { time: "18:00", mean: 9, gust: 17, dir: "NNW" },
    { time: "19:00", mean: 8, gust: 16, dir: "NNW" },
    { time: "20:00", mean: 7, gust: 14, dir: "NNW" },
    { time: "21:00", mean: 6, gust: 12, dir: "NNW" },
    { time: "22:00", mean: 5, gust: 11, dir: "NW" },
    { time: "23:00", mean: 5, gust: 11, dir: "NW" }
  ],
  tides: [
    { time: "01:46", type: "Low water", height: 1.10 },
    { time: "07:36", type: "High water", height: 4.60 },
    { time: "13:58", type: "Low water", height: 1.10 },
    { time: "19:46", type: "High water", height: 4.80 }
  ],
  tideCurve: [
    { time: "00:00", height: 1.73 }, { time: "01:00", height: 1.22 }, { time: "02:00", height: 1.11 },
    { time: "03:00", height: 1.47 }, { time: "04:00", height: 2.22 }, { time: "05:00", height: 3.15 },
    { time: "06:00", height: 3.99 }, { time: "07:00", height: 4.51 }, { time: "08:00", height: 4.57 },
    { time: "09:00", height: 4.20 }, { time: "10:00", height: 3.51 }, { time: "11:00", height: 2.66 },
    { time: "12:00", height: 1.86 }, { time: "13:00", height: 1.30 }, { time: "14:00", height: 1.10 },
    { time: "15:00", height: 1.38 }, { time: "16:00", height: 2.11 }, { time: "17:00", height: 3.08 },
    { time: "18:00", height: 4.02 }, { time: "19:00", height: 4.64 }, { time: "20:00", height: 4.79 },
    { time: "21:00", height: 4.48 }, { time: "22:00", height: 3.81 }, { time: "23:00", height: 2.94 }
  ]
};
