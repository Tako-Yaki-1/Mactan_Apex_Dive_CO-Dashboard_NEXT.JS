"use client";

import { useState } from "react";
import { CalendarCheck, Receipt, Users, Wallet } from "lucide-react";
import { ChartCard } from "@/components/ChartCard";
import { usePeriod } from "@/components/PeriodContext";
import { Segmented } from "@/components/Segmented";
import type { OverviewData } from "@/lib/analytics";
import type { Period } from "@/lib/period";
import { RevenueChart, WeekdayChart } from "./Charts";
import { KpiCard } from "./KpiCard";
import { ActivityList, Heatmap, PackageBars } from "./Panels";

const METRICS = [
  { value: "revenue", label: "Revenue" },
  { value: "bookings", label: "Bookings" },
] as const;

export function OverviewView({ data }: { data: Record<Period, OverviewData> }) {
  const { period } = usePeriod();
  const [metric, setMetric] = useState<"revenue" | "bookings">("revenue");
  const view = data[period];
  const heatmapEnd = view.heatmap[view.heatmap.length - 1];
  const trend = view.trend.map((point) =>
    metric === "revenue"
      ? point
      : { label: point.label, actual: point.bookings, predicted: point.predictedBookings },
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Mactan Apex Dive Co.
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Business overview</h1>
        </div>
        <p className="text-[11px] text-muted">Updated {view.updated} · Amounts in PHP</p>
      </div>

      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total revenue"
          href="/descriptive"
          value={view.kpis.revenue.value}
          change={view.kpis.revenue.change}
          spark={view.kpis.revenue.spark}
          icon={Wallet}
          format="peso"
        />
        <KpiCard
          label="Bookings"
          href="/descriptive"
          value={view.kpis.bookings.value}
          change={view.kpis.bookings.change}
          spark={view.kpis.bookings.spark}
          icon={CalendarCheck}
        />
        <KpiCard
          label="Customers"
          href="/descriptive"
          value={view.kpis.customers.value}
          change={view.kpis.customers.change}
          spark={view.kpis.customers.spark}
          icon={Users}
        />
        <KpiCard
          label="Avg. booking value"
          href="/descriptive"
          value={view.kpis.avg.value}
          change={view.kpis.avg.change}
          spark={view.kpis.avg.spark}
          icon={Receipt}
          format="peso"
        />
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Revenue trend"
          subtitle={
            metric === "revenue"
              ? "Actual revenue against the predicted baseline"
              : "Actual bookings against the predicted baseline"
          }
          className="xl:col-span-2"
          action={
            <div className="flex flex-wrap items-center justify-end gap-3 text-[10px] text-muted">
              <Segmented label="Trend metric" value={metric} options={METRICS} onChange={setMetric} />
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white" />
                Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-px w-4 bg-accent" />
                Predicted
              </span>
            </div>
          }
        >
          <RevenueChart data={trend} metric={metric} />
        </ChartCard>

        <ChartCard title="Bookings by weekday" subtitle="Demand is strongest on weekends">
          <WeekdayChart data={view.weekdays} />
        </ChartCard>
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Recent activity"
          subtitle="Latest transactions"
          action={<span className="text-[10px] text-muted">Last 5</span>}
        >
          <ActivityList items={view.activity} />
        </ChartCard>

        <ChartCard
          title="Revenue by package"
          subtitle="Top products this period"
          action={<span className="text-[10px] text-muted">This period</span>}
        >
          <PackageBars items={view.packages} />
        </ChartCard>

        <ChartCard
          title="Booking heatmap"
          subtitle="Weekday density, last 6 months"
          action={
            <span className="text-[10px] text-muted">
              {view.heatmap[0]?.label} – {heatmapEnd?.label}
            </span>
          }
        >
          <Heatmap months={view.heatmap} />
        </ChartCard>
      </div>
    </div>
  );
}
