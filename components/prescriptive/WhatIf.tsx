"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { formatPeso } from "@/lib/format";

const QUARTERLY_BUDGET = 180_000;

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.02] p-3">
      <p className="text-[10px] text-muted">{label}</p>
      <p className={`mt-1 text-sm font-medium tabular-nums ${accent ? "text-positive" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export function WhatIf({ baseline }: { baseline: number }) {
  const [increase, setIncrease] = useState(20);
  const upliftRate = 0.001 * increase;
  const projected = Math.round(baseline * (1 + upliftRate));
  const incremental = projected - baseline;
  const cost = Math.round((QUARTERLY_BUDGET * increase) / 100);
  const net = incremental - cost;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-medium tracking-wide text-white">
            What-if: weekend campaign budget
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Every 10% budget increase adds about 1% in quarterly revenue.
          </p>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.07] px-2 py-0.5 text-[10px] text-accent">
          Live model
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[26px] font-semibold leading-none tracking-tight tabular-nums">
            {formatPeso(projected)}
          </p>
          <p className="mt-1 text-[10px] text-muted">Projected next-quarter revenue</p>
        </div>
        <p className="text-xs font-medium text-positive">+{(upliftRate * 100).toFixed(1)}%</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <label htmlFor="budget" className="sr-only">
          Weekend campaign budget increase
        </label>
        <input
          id="budget"
          type="range"
          min={0}
          max={50}
          step={5}
          value={increase}
          onChange={(event) => setIncrease(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-accent"
        />
        <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-white">
          +{increase}%
        </span>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span>No change</span>
        <span>+50% budget</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Incremental revenue" value={`+${formatPeso(incremental)}`} accent />
        <Metric label="Campaign cost" value={formatPeso(cost)} />
        <Metric label="Net gain" value={formatPeso(net)} accent={net >= 0} />
        <Metric label="Baseline revenue" value={formatPeso(baseline)} />
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-muted">
        Model assumes a {formatPeso(QUARTERLY_BUDGET)} quarterly weekend budget. Net gain subtracts
        the added budget from incremental revenue.
      </p>
    </Card>
  );
}
