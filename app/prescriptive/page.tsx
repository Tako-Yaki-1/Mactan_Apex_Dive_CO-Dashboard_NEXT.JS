export const instant = false;

import {
  ArrowUpRight,
  GraduationCap,
  Megaphone,
  Repeat2,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/Card";
import { FlowStrip } from "@/components/FlowStrip";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { WhatIf } from "@/components/prescriptive/WhatIf";
import { getForecast } from "@/lib/forecast-data";
import { formatPeso } from "@/lib/format";

export default async function PrescriptivePage() {
  const forecast = await getForecast();
  const weekendImpact = forecast.total * 0.02;
  const lowSeasonImpact = forecast.total * 0.045;
  const rebookImpact = forecast.total * 0.02;
  const totalUplift = weekendImpact + lowSeasonImpact + rebookImpact;
  const target = forecast.total + totalUplift;
  const programCost = 180_000 * 0.2 + 60_000 + 25_000;

  const recommendations = [
    {
      icon: Megaphone,
      priority: "High",
      title: "Capture weekend demand",
      why: "Weekend bookings carry the largest share of demand. Shift 20% of paid budget into Friday–Sunday Island Safari offers.",
      impact: weekendImpact,
      timing: "Immediate",
    },
    {
      icon: GraduationCap,
      priority: "Medium",
      title: "Build a low-season course bundle",
      why: "August is consistently the softest month. Package the Open Water Course with accommodation for June to September.",
      impact: lowSeasonImpact,
      timing: "Q2 2027",
    },
    {
      icon: Repeat2,
      priority: "High",
      title: "Rebook Discover Scuba guests",
      why: "Discover Scuba is the fourth package by revenue and the natural entry point to certification courses. Offer a 30-day upgrade credit.",
      impact: rebookImpact,
      timing: "30 days",
    },
  ];

  return (
    <div className="space-y-4">
      <FlowStrip current="prescriptive" />

      <PageHeader
        eyebrow="Step 3 of 3 · Prescriptive"
        title="Prescriptive analysis"
        description="What we should do: three actions tied to the forecast, with a live what-if model for the weekend campaign."
      />

      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Baseline forecast"
          value={formatPeso(forecast.total)}
          hint="Next quarter before recommendations"
          icon={TrendingUp}
        />
        <StatCard
          label="Recommended target"
          value={formatPeso(target)}
          hint={`+${((totalUplift / forecast.total) * 100).toFixed(1)}% over the baseline`}
          icon={Target}
        />
        <StatCard
          label="Expected uplift"
          value={`+${formatPeso(totalUplift)}`}
          hint="Three actions combined"
          icon={ArrowUpRight}
        />
        <StatCard
          label="Program cost"
          value={formatPeso(programCost)}
          hint={`Net gain ${formatPeso(totalUplift - programCost)}`}
          icon={Wallet}
        />
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        {recommendations.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-white/75">
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    item.priority === "High"
                      ? "bg-accent/10 text-accent"
                      : "bg-white/[0.05] text-muted"
                  }`}
                >
                  {item.priority} priority
                </span>
              </div>

              <h2 className="mt-4 text-sm font-medium text-white">{item.title}</h2>
              <p className="mt-2 flex-1 text-[11px] leading-relaxed text-muted">{item.why}</p>

              <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
                <div>
                  <p className="text-[10px] text-muted">Estimated impact</p>
                  <p className="mt-0.5 text-base font-semibold tabular-nums text-white">
                    +{formatPeso(item.impact)}
                  </p>
                </div>
                <span className="text-[10px] text-muted">{item.timing}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WhatIf baseline={forecast.total} />
        </div>

        <Card>
          <h2 className="text-[13px] font-medium tracking-wide text-white">Decision</h2>
          <p className="mt-0.5 text-xs text-muted">What to approve now</p>

          <div className="mt-4 space-y-3 text-[11px] leading-relaxed">
            <p className="rounded-xl border border-accent/20 bg-accent/[0.04] p-3 text-white/80">
              Approve the 20% weekend budget reallocation and the rebooking pilot now. Plan the
              low-season course bundle for Q2 2027.
            </p>
            <p className="text-muted">
              The baseline comes from the predictive forecast. Uplift figures are planning
              estimates, not guarantees. Review results after 30 days before scaling spend.
            </p>
            <p className="flex items-center gap-2 text-[10px] text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              Tied to the next-quarter forecast of {formatPeso(forecast.total)}.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
