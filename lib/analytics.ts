import { cache } from "react";
import { getRawTables, type TableSource } from "./data";
import type { Period } from "./period";

const DAY_MS = 86_400_000;

const WINDOW_DAYS: Record<Period, number> = {
  "30d": 30,
  "90d": 90,
  "12m": 365,
  all: 0,
};

const dayFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const monthYearFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});
const fullDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type Sale = { sale_id: number; customer_id: number; package_id: number; sale_date: string };
type Transaction = {
  transaction_id: number;
  sale_id: number;
  payment_date: string;
  amount_paid: number;
  status: string;
};

export type Kpi = { value: number; change: number; spark: number[] };

export type OverviewData = {
  updated: string;
  kpis: {
    revenue: Kpi;
    bookings: Kpi;
    customers: Kpi;
    avg: Kpi;
  };
  trend: { label: string; actual: number; predicted: number; bookings: number; predictedBookings: number }[];
  weekdays: { label: string; bookings: number }[];
  packages: { name: string; revenue: number; percent: number }[];
  heatmap: { label: string; values: number[] }[];
  activity: { name: string; package: string; amount: number; date: string }[];
};

export type Analytics = {
  overviewByPeriod: Record<Period, OverviewData>;
  source: TableSource;
  earliestSaleDate: string;
  latestSaleDate: string;
  counts: { customers: number; packages: number; campaigns: number; sales: number; transactions: number };
};

type Bucket = { label: string; sales: Sale[] };

function parseDate(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00Z`);
}

function dateKey(value: string) {
  return value.slice(0, 10);
}

function addDays(value: string, days: number) {
  return new Date(parseDate(value).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

function monthStart(value: string) {
  return `${value.slice(0, 7)}-01`;
}

function addMonths(value: string, months: number) {
  const date = parseDate(value);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1))
    .toISOString()
    .slice(0, 10);
}

function distinctCustomers(sales: Sale[]) {
  return new Set(sales.map((sale) => sale.customer_id)).size;
}

function makeKpi(current: number, previous: number, spark: number[]): Kpi {
  return {
    value: current,
    change: previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1_000) / 10,
    spark,
  };
}

function makeBuckets(sales: Sale[], start: string, end: string, period: Period): Bucket[] {
  if (period === "30d") {
    return Array.from({ length: 30 }, (_, index) => {
      const key = addDays(start, index);
      return {
        label: dayFmt.format(parseDate(key)),
        sales: sales.filter((sale) => dateKey(sale.sale_date) === key),
      };
    });
  }

  if (period === "90d") {
    const buckets: Bucket[] = [];
    let cursor = end;
    while (cursor >= start) {
      const from = cursor > addDays(start, 6) ? addDays(cursor, -6) : start;
      buckets.unshift({
        label: dayFmt.format(parseDate(from)),
        sales: sales.filter((sale) => {
          const key = dateKey(sale.sale_date);
          return key >= from && key <= cursor;
        }),
      });
      cursor = addDays(from, -1);
    }
    return buckets;
  }

  const buckets: Bucket[] = [];
  let cursor = monthStart(start);
  const lastMonth = monthStart(end);
  while (cursor <= lastMonth) {
    const next = addMonths(cursor, 1);
    buckets.push({
      label:
        period === "all"
          ? monthYearFmt.format(parseDate(cursor)).replace(" ", " '")
          : monthFmt.format(parseDate(cursor)),
      sales: sales.filter((sale) => {
        const key = dateKey(sale.sale_date);
        return key >= cursor && key < next;
      }),
    });
    cursor = next;
  }
  return buckets;
}

export const getAnalytics = cache(async (): Promise<Analytics> => {
  const { tables, source } = await getRawTables();
  const { customers, packages, campaigns, sales, transactions } = tables;

  const customerName = new Map(customers.map((row) => [row.customer_id, row.full_name]));
  const packageName = new Map(packages.map((row) => [row.package_id, row.package_name]));
  const packageCategory = new Map(packages.map((row) => [row.package_id, row.category]));
  const saleById = new Map(sales.map((sale) => [sale.sale_id, sale]));

  const paidBySale = new Map<number, number>();
  for (const transaction of transactions) {
    if (transaction.status !== "Paid") continue;
    paidBySale.set(
      transaction.sale_id,
      (paidBySale.get(transaction.sale_id) ?? 0) + transaction.amount_paid,
    );
  }

  const saleDate = (sale: Sale) => dateKey(sale.sale_date);
  const revenueOf = (rows: Sale[]) =>
    rows.reduce((total, sale) => total + (paidBySale.get(sale.sale_id) ?? 0), 0);

  const dates = sales.map(saleDate).sort();
  const latestSaleDate = dates[dates.length - 1] ?? "2026-10-31";
  const earliestSaleDate = dates[0] ?? latestSaleDate;
  const latestMonth = monthStart(latestSaleDate);

  const windowFor = (period: Period) => {
    if (period === "all") return { start: earliestSaleDate, end: latestSaleDate };
    const start = addDays(latestSaleDate, -(WINDOW_DAYS[period] - 1));
    return { start, end: latestSaleDate };
  };

  const activitySource = [...transactions]
    .filter((transaction) => transaction.status === "Paid" && saleById.has(transaction.sale_id))
    .sort(
      (left, right) =>
        dateKey(right.payment_date).localeCompare(dateKey(left.payment_date)) ||
        right.transaction_id - left.transaction_id,
    );

  const getOverview = (period: Period): OverviewData => {
    const { start, end } = windowFor(period);
    const days = WINDOW_DAYS[period];
    const previousEnd = addDays(start, -1);
    const previousStart = days > 0 ? addDays(start, -days) : earliestSaleDate;
    const compare = days > 0 ? { start: previousStart, end: previousEnd } : null;

    const inWindow = (sale: Sale, from: string, to: string) => {
      const key = saleDate(sale);
      return key >= from && key <= to;
    };

    const salesInWindow = sales.filter((sale) => inWindow(sale, start, end));
    const salesBefore = compare
      ? sales.filter((sale) => inWindow(sale, compare.start, compare.end))
      : [];

    const revenue = revenueOf(salesInWindow);
    const previousRevenue = revenueOf(salesBefore);
    const bookings = salesInWindow.length;
    const previousBookings = salesBefore.length;
    const customersInWindow = distinctCustomers(salesInWindow);
    const previousCustomers = distinctCustomers(salesBefore);
    const avg = Math.round(revenue / Math.max(1, bookings));
    const previousAvg = Math.round(previousRevenue / Math.max(1, previousBookings));

    const buckets = makeBuckets(salesInWindow, start, end, period);
    const trend = buckets.map((bucket, index) => {
      const actual = revenueOf(bucket.sales);
      const bookingCount = bucket.sales.length;
      const recent = buckets.slice(Math.max(0, index - 2), index + 1);
      const average = (read: (item: Bucket) => number) =>
        Math.round(recent.reduce((total, item) => total + read(item), 0) / recent.length);
      return {
        label: bucket.label,
        actual,
        predicted: index < 2 ? actual : average((item) => revenueOf(item.sales)),
        bookings: bookingCount,
        predictedBookings: index < 2 ? bookingCount : average((item) => item.sales.length),
      };
    });

    const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];
    const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekdays = weekdayOrder.map((weekday, index) => ({
      label: weekdayLabels[index],
      bookings: salesInWindow.filter((sale) => parseDate(sale.sale_date).getUTCDay() === weekday).length,
    }));

    const categoryRevenue = new Map<string, number>();
    for (const sale of salesInWindow) {
      const category = packageCategory.get(sale.package_id) ?? "Other";
      categoryRevenue.set(
        category,
        (categoryRevenue.get(category) ?? 0) + (paidBySale.get(sale.sale_id) ?? 0),
      );
    }
    const packagesTop = [...categoryRevenue.entries()]
      .map(([name, value]) => ({
        name,
        revenue: value,
        percent: revenue ? (value / revenue) * 100 : 0,
      }))
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 5);

    const heatmap = Array.from({ length: 6 }, (_, index) => {
      const month = addMonths(latestMonth, index - 5);
      const next = addMonths(month, 1);
      const values = Array(7).fill(0);
      for (const sale of sales) {
        const key = saleDate(sale);
        if (key >= month && key < next) {
          values[(parseDate(sale.sale_date).getUTCDay() + 6) % 7] += 1;
        }
      }
      return { label: monthFmt.format(parseDate(month)), values };
    });

    const activity = activitySource
      .filter((transaction) => {
        const sale = saleById.get(transaction.sale_id);
        return sale ? inWindow(sale, start, end) : false;
      })
      .slice(0, 5)
      .map((transaction) => {
        const sale = saleById.get(transaction.sale_id)!;
        return {
          name: customerName.get(sale.customer_id) ?? "Unknown customer",
          package: packageName.get(sale.package_id) ?? "Unknown package",
          amount: transaction.amount_paid,
          date: dayFmt.format(parseDate(transaction.payment_date)),
        };
      });

    return {
      updated: fullDateFmt.format(parseDate(latestSaleDate)),
      kpis: {
        revenue: makeKpi(revenue, previousRevenue, buckets.map((bucket) => revenueOf(bucket.sales))),
        bookings: makeKpi(bookings, previousBookings, buckets.map((bucket) => bucket.sales.length)),
        customers: makeKpi(
          customersInWindow,
          previousCustomers,
          buckets.map((bucket) => distinctCustomers(bucket.sales)),
        ),
        avg: makeKpi(
          avg,
          previousAvg,
          buckets.map((bucket) => {
            const value = revenueOf(bucket.sales);
            return bucket.sales.length ? value / bucket.sales.length : 0;
          }),
        ),
      },
      trend,
      weekdays,
      packages: packagesTop,
      heatmap,
      activity,
    };
  };

  return {
    overviewByPeriod: {
      "30d": getOverview("30d"),
      "90d": getOverview("90d"),
      "12m": getOverview("12m"),
      all: getOverview("all"),
    },
    source,
    earliestSaleDate,
    latestSaleDate,
    counts: {
      customers: customers.length,
      packages: packages.length,
      campaigns: campaigns.length,
      sales: sales.length,
      transactions: transactions.length,
    },
  };
});
