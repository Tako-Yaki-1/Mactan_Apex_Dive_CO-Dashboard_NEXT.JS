const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatNumber(value: number) {
  return number.format(Math.round(value));
}

export function formatPeso(value: number) {
  return `₱${number.format(Math.round(value))}`;
}

export function formatCompactPeso(value: number) {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₱${Math.round(value / 1_000)}k`;
  return `₱${Math.round(value)}`;
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
