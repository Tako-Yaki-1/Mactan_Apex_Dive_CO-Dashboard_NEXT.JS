"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTheme } from "@/lib/chart-theme";
import { formatCompactPeso, formatNumber, formatPeso } from "@/lib/format";

type TrendPoint = { label: string; actual: number; predicted: number };

export function RevenueChart({
  data,
  metric = "revenue",
}: {
  data: TrendPoint[];
  metric?: "revenue" | "bookings";
}) {
  const money = metric === "revenue";

  return (
    <div className="h-[252px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartTheme.grid} vertical={false} />
          <XAxis
            dataKey="label"
            {...chartTheme.axis}
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis
            {...chartTheme.axis}
            width={54}
            tickFormatter={(value) =>
              money ? formatCompactPeso(Number(value)) : formatNumber(Number(value))
            }
          />
          <Tooltip
            {...chartTheme.tooltip}
            formatter={(value) =>
              money ? formatPeso(Number(value)) : `${formatNumber(Number(value))} bookings`
            }
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={chartTheme.line}
            strokeWidth={2}
            fill="url(#revenue-fill)"
            activeDot={{ r: 4, fill: chartTheme.accent, stroke: "#111111" }}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            name="Predicted"
            stroke={chartTheme.accent}
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="transparent"
            dot={false}
            activeDot={{ r: 4, fill: chartTheme.accent, stroke: "#111111" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type WeekdayPoint = { label: string; bookings: number };

export function WeekdayChart({ data }: { data: WeekdayPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const total = data.reduce((sum, point) => sum + point.bookings, 0);
  const focus = selected === null ? null : data[selected];

  return (
    <div>
      <div className="h-[252px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="label" {...chartTheme.axis} tickMargin={10} />
            <YAxis
              {...chartTheme.axis}
              width={44}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
              formatter={(value) => `${formatNumber(Number(value))} bookings`}
            />
            <Bar
              dataKey="bookings"
              name="Bookings"
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
              onMouseLeave={() => setActive(null)}
              onClick={(_, index) => setSelected((current) => (current === index ? null : index))}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={
                    index === active || index === selected
                      ? chartTheme.accent
                      : "rgba(255,255,255,0.14)"
                  }
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActive(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] text-muted" aria-live="polite">
        {focus ? (
          <>
            <span className="font-medium text-white">{focus.label}</span> · {formatNumber(focus.bookings)}{" "}
            bookings · {((focus.bookings / Math.max(1, total)) * 100).toFixed(1)}% of all bookings
          </>
        ) : (
          "Click a bar to see its share of all bookings."
        )}
      </p>
    </div>
  );
}
