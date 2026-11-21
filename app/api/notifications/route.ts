import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";
import { getRawTables } from "@/lib/data";
import { getForecast } from "@/lib/forecast-data";
import { formatPeso } from "@/lib/format";

// Builds the notification list from the same data that feeds the charts.
export async function GET() {
  const [{ overviewByPeriod }, forecast, { tables }] = await Promise.all([
    getAnalytics(),
    getForecast(),
    getRawTables(),
  ]);

  const view = overviewByPeriod["12m"];
  const nextMonth = forecast.rows[0];
  const totalBookings = view.weekdays.reduce((sum, day) => sum + day.bookings, 0);
  const weekendBookings = view.weekdays
    .filter((day) => ["Fri", "Sat", "Sun"].includes(day.label))
    .reduce((sum, day) => sum + day.bookings, 0);
  const softest = view.trend.reduce((low, point) => (point.actual < low.actual ? point : low), view.trend[0]);
  const top = view.packages[0];
  const pending = tables.transactions.filter((item) => item.status === "Pending").length;

  const items = [
    {
      id: "forecast",
      title: `${nextMonth.label} forecast`,
      text: `Expected revenue is ${formatPeso(nextMonth.revenue)} from about ${nextMonth.bookings} bookings.`,
      href: "/predictive",
    },
    {
      id: "weekend",
      title: "Weekend demand",
      text: `Friday to Sunday carry ${Math.round((weekendBookings / Math.max(1, totalBookings)) * 100)}% of bookings in the last 12 months.`,
      href: "/descriptive",
    },
    {
      id: "pending",
      title: "Pending payments",
      text: `${pending} transactions are still pending and count as no revenue yet.`,
      href: "/data?table=transactions&q=Pending",
    },
    {
      id: "softest",
      title: "Softest month",
      text: `${softest.label} was the weakest month at ${formatPeso(softest.actual)}. Plan an off-season offer.`,
      href: "/prescriptive",
    },
    ...(top
      ? [
          {
            id: "top-package",
            title: `${top.name} leads revenue`,
            text: `${top.percent.toFixed(0)}% of revenue in the last 12 months (${formatPeso(top.revenue)}).`,
            href: "/descriptive",
          },
        ]
      : []),
  ];

  return NextResponse.json({ items });
}
