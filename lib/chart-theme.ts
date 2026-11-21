export const chartTheme = {
  accent: "#ff4a1c",
  accentSoft: "rgba(255, 74, 28, 0.18)",
  line: "#f2f2f2",
  muted: "#9a9a9a",
  grid: "rgba(255, 255, 255, 0.06)",
  axis: {
    stroke: "#7d7d7d",
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  },
  tooltip: {
    contentStyle: {
      background: "#161616",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: 12,
      boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45)",
      fontSize: 12,
    },
    labelStyle: { color: "#9a9a9a", marginBottom: 4 },
    itemStyle: { color: "#ffffff" },
    cursor: { stroke: "rgba(255, 255, 255, 0.16)", strokeWidth: 1 },
  },
} as const;
