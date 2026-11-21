import { getAnalytics } from "./analytics";

// Nov-Jan run above the Aug-Oct base because the dry season starts.
const SEASON = [1.12, 1.22, 1.2];

const monthYearFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});
const longMonthFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function addMonths(value: string, months: number) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

export type ForecastRow = { label: string; revenue: number; bookings: number };

export type Forecast = {
  rows: ForecastRow[];
  chart: { label: string; actual: number | null; forecast: number | null }[];
  total: number;
  bookings: number;
  growth: number;
  low: number;
  high: number;
  boundary: string;
  monthlyGrowth: number;
  rangeLabel: string;
  previousLabel: string;
};

export async function getForecast(): Promise<Forecast> {
  const { overviewByPeriod, latestSaleDate } = await getAnalytics();
  const history = overviewByPeriod.all.trend.slice(-12);
  const recent = history.slice(-3);
  const average = recent.reduce((total, point) => total + point.actual, 0) / Math.max(1, recent.length);

  const first = history[Math.max(0, history.length - 7)]?.actual ?? 0;
  const last = history[history.length - 1]?.actual ?? 0;
  const monthlyGrowth = first > 0 ? Math.pow(last / first, 1 / 6) - 1 : 0;

  const latestMonth = `${latestSaleDate.slice(0, 7)}-01`;
  const futureMonths = [1, 2, 3].map((offset) => addMonths(latestMonth, offset));
  const rows = futureMonths.map((month, index) => ({
    label: monthYearFmt.format(month).replace(" ", " '"),
    revenue: Math.round(average * Math.pow(1 + monthlyGrowth, index + 1) * SEASON[index]),
  }));

  const total = rows.reduce((sum, row) => sum + row.revenue, 0);
  const lastQuarter = recent.reduce((sum, point) => sum + point.actual, 0);
  const avgBooking = overviewByPeriod["12m"].kpis.avg.value;

  return {
    rows: rows.map((row) => ({
      ...row,
      bookings: Math.round(row.revenue / Math.max(1, avgBooking)),
    })),
    chart: [
      ...history.map((point, index) => ({
        label: point.label,
        actual: point.actual,
        forecast: index === history.length - 1 ? point.actual : null,
      })),
      ...rows.map((row) => ({ label: row.label, actual: null, forecast: row.revenue })),
    ],
    total,
    bookings: Math.round(total / Math.max(1, avgBooking)),
    growth: lastQuarter ? ((total - lastQuarter) / lastQuarter) * 100 : 0,
    low: Math.round(total * 0.92),
    high: Math.round(total * 1.08),
    boundary: rows[0].label,
    monthlyGrowth: monthlyGrowth * 100,
    rangeLabel: `${longMonthFmt.format(futureMonths[0])} to ${longMonthFmt.format(futureMonths[2])}`,
    previousLabel: `${longMonthFmt.format(addMonths(latestMonth, -3))} to ${longMonthFmt.format(
      addMonths(latestMonth, -1),
    )}`,
  };
}
