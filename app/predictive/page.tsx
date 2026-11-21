export const instant = false;

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { ChartCard } from "@/components/ChartCard";
import { FlowStrip } from "@/components/FlowStrip";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { getForecast } from "@/lib/forecast-data";
import {
  formatCompactPeso,
  formatNumber,
  formatPercent,
  formatPeso,
} from "@/lib/format";
import { ForecastChart } from "@/components/predictive/ForecastChart";

export default async function PredictivePage() {
  const forecast = await getForecast();

  return (
    <div className="space-y-4">
      <FlowStrip current="predictive" />

      <PageHeader
        eyebrow="Step 2 of 3 · Predictive"
        title="Predictive analysis"
        description="What will happen: a three-month revenue forecast built from the last twelve months of actual sales."
      />

      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Next-quarter revenue"
          value={formatPeso(forecast.total)}
          hint={forecast.rangeLabel}
          icon={TrendingUp}
        />
        <StatCard
          label="Expected bookings"
          value={formatNumber(forecast.bookings)}
          hint="At the current average booking value"
          icon={CalendarCheck}
        />
        <StatCard
          label="Growth vs last quarter"
          value={formatPercent(forecast.growth)}
          hint={`Compared with ${forecast.previousLabel}`}
          icon={ArrowUpRight}
        />
        <StatCard
          label="Planning range"
          value={`${formatCompactPeso(forecast.low)} – ${formatCompactPeso(forecast.high)}`}
          hint="±8% forecast margin"
          icon={Target}
        />
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Revenue forecast"
          subtitle={`Twelve months of history plus the next three months`}
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white" />
                Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-px w-4 bg-accent" />
                Forecast
              </span>
            </div>
          }
        >
          <ForecastChart data={forecast.chart} boundary={forecast.boundary} />
        </ChartCard>

        <Card>
          <h2 className="text-[13px] font-medium tracking-wide text-white">Forecast model</h2>
          <p className="mt-0.5 text-xs text-muted">Simple, transparent, and reproducible</p>

          <dl className="mt-5 space-y-3 text-[11px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Method</dt>
              <dd className="text-right text-white/80">3-month moving average + trend</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">History</dt>
              <dd className="text-right text-white/80">12 months of revenue</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Trend</dt>
              <dd className="text-right text-white/80">
                {formatPercent(forecast.monthlyGrowth)} per month
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Seasonality</dt>
              <dd className="text-right text-white/80">Dry-season lift, Nov–Jan</dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2 border-t border-line pt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Next three months</p>
            {forecast.rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-white/80">{row.label}</span>
                <span className="tabular-nums text-white">{formatPeso(row.revenue)}</span>
                <span className="w-16 text-right text-[10px] tabular-nums text-muted">
                  {formatNumber(row.bookings)} bookings
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/descriptive"
            className="mt-5 flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/[0.04] p-3 text-[11px] leading-relaxed text-white/70 transition hover:border-accent/35 hover:text-white"
          >
            <span className="mt-0.5 text-accent">Descriptive input</span>
            <span className="flex-1">
              Weekend demand and package mix set the seasonal pattern. Open the descriptive step to
              review the evidence.
            </span>
            <ArrowRight size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
