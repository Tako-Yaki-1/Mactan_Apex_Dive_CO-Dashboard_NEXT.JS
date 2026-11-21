"use client";

import { CalendarCheck, CalendarDays, Receipt, TrendingDown, TrendingUp, Users, Wallet, Waves } from "lucide-react";
import { Card } from "@/components/Card";
import { ChartCard } from "@/components/ChartCard";
import { FlowStrip } from "@/components/FlowStrip";
import { PageHeader } from "@/components/PageHeader";
import { usePeriod } from "@/components/PeriodContext";
import { formatPeso } from "@/lib/format";
import type { OverviewData } from "@/lib/analytics";
import type { Period } from "@/lib/period";
import { KpiCard } from "@/components/overview/KpiCard";
import { RevenueChart, WeekdayChart } from "@/components/overview/Charts";

type InsightProps = {
  icon: typeof TrendingUp;
  title: string;
  text: string;
};

function Insight({ icon: Icon, title, text }: InsightProps) {
  return (
    <div className="flex gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/60">
        <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-medium text-white">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

export function DescriptiveView({ data }: { data: Record<Period, OverviewData> }) {
  const { period } = usePeriod();
  const view = data[period];

  const peak = view.trend.reduce((best, point) => (point.actual > best.actual ? point : best), view.trend[0]);
  const low = view.trend.reduce((worst, point) => (point.actual < worst.actual ? point : worst), view.trend[0]);
  const totalBookings = view.weekdays.reduce((total, day) => total + day.bookings, 0);
  const weekendBookings = view.weekdays
    .filter((day) => ["Fri", "Sat", "Sun"].includes(day.label))
    .reduce((total, day) => total + day.bookings, 0);
  const weekendShare = Math.round((weekendBookings / Math.max(1, totalBookings)) * 100);
  const top = view.packages[0];
  const bottom = view.packages[view.packages.length - 1];
  const maxRevenue = top.revenue || 1;

  return (
    <div className="space-y-4">
      <FlowStrip current="descriptive" />

      <PageHeader
        eyebrow="Step 1 of 3 · Descriptive"
        title="Descriptive analysis"
        description="What happened: revenue, demand patterns, and the packages that drive results in the selected period."
      />

      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total revenue"
          value={view.kpis.revenue.value}
          change={view.kpis.revenue.change}
          spark={view.kpis.revenue.spark}
          icon={Wallet}
          format="peso"
        />
        <KpiCard
          label="Bookings"
          value={view.kpis.bookings.value}
          change={view.kpis.bookings.change}
          spark={view.kpis.bookings.spark}
          icon={CalendarCheck}
        />
        <KpiCard
          label="Customers"
          value={view.kpis.customers.value}
          change={view.kpis.customers.change}
          spark={view.kpis.customers.spark}
          icon={Users}
        />
        <KpiCard
          label="Avg. booking value"
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
          subtitle="Actual revenue against the predicted baseline"
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-[10px] text-muted">
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
          <RevenueChart data={view.trend} />
        </ChartCard>

        <ChartCard title="Demand by weekday" subtitle="Bookings across the week">
          <WeekdayChart data={view.weekdays} />
        </ChartCard>
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-medium tracking-wide text-white">Package performance</h2>
              <p className="mt-0.5 text-xs text-muted">Ranked by revenue for the selected period</p>
            </div>
            <span className="text-[10px] text-muted">Revenue · share</span>
          </div>

          <div className="mt-5 space-y-4">
            {view.packages.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                    index === 0 ? "bg-accent text-white" : "bg-white/[0.05] text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="flex min-w-0 items-center gap-2 text-xs text-white/85">
                      <span className="truncate">{item.name}</span>
                      {index === 0 ? (
                        <span className="shrink-0 rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] text-accent">
                          Top
                        </span>
                      ) : null}
                      {index === view.packages.length - 1 ? (
                        <span className="shrink-0 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-muted">
                          Watch
                        </span>
                      ) : null}
                    </p>
                    <p className="shrink-0 text-[11px] tabular-nums text-muted">{formatPeso(item.revenue)}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className={`h-full rounded-full ${index === 0 ? "bg-accent" : "bg-white/20"}`}
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[10px] tabular-nums text-muted">
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-[13px] font-medium tracking-wide text-white">What the data says</h2>
          <p className="mt-0.5 text-xs text-muted">Patterns carried into the predictive step</p>

          <div className="mt-5 space-y-4">
            <Insight
              icon={TrendingUp}
              title={`${peak.label} was the peak`}
              text={`${formatPeso(peak.actual)} in revenue, the strongest period in this view.`}
            />
            <Insight
              icon={CalendarDays}
              title={`Weekends drive ${weekendShare}% of bookings`}
              text="Friday to Sunday demand should guide boat and staff scheduling."
            />
            <Insight
              icon={TrendingDown}
              title={`${low.label} was the softest`}
              text={`${formatPeso(low.actual)} in revenue. This is the case for a low-season offer.`}
            />
            <Insight
              icon={Waves}
              title={`${top.name} leads revenue`}
              text={`${top.percent.toFixed(0)}% of period revenue. ${bottom.name} is the lowest at ${bottom.percent.toFixed(0)}%.`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
