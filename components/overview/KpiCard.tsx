"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/Card";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber, formatPeso } from "@/lib/format";
import { Sparkline } from "./Sparkline";

type KpiCardProps = {
  label: string;
  value: number;
  change: number;
  spark: number[];
  icon: LucideIcon;
  format?: "peso" | "number";
  href?: string;
};

export function KpiCard({ label, value, change, spark, icon: Icon, format = "number", href }: KpiCardProps) {
  const displayed = useCountUp(value);
  const positive = change >= 0;

  const card = (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
            <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span>{label}</span>
        </div>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            positive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={11} aria-hidden="true" />
          ) : (
            <ArrowDownRight size={11} aria-hidden="true" />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>

      <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight tabular-nums">
        {format === "peso" ? formatPeso(displayed) : formatNumber(displayed)}
      </p>

      <div className="mt-4">
        <Sparkline values={spark} positive={positive} />
      </div>
      <p className="mt-1 text-[10px] text-muted">vs previous period</p>
    </Card>
  );

  return href ? (
    <Link href={href} aria-label={`${label}: open the descriptive analysis`} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
