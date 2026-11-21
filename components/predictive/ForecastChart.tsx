"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTheme } from "@/lib/chart-theme";
import { formatCompactPeso, formatPeso } from "@/lib/format";

type ForecastPoint = {
  label: string;
  actual: number | null;
  forecast: number | null;
};

export function ForecastChart({ data, boundary }: { data: ForecastPoint[]; boundary: string }) {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 20, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartTheme.grid} vertical={false} />
          <XAxis
            dataKey="label"
            {...chartTheme.axis}
            fontSize={9}
            tickMargin={10}
            interval={0}
            angle={-40}
            textAnchor="end"
            height={46}
          />
          <YAxis
            {...chartTheme.axis}
            width={54}
            tickFormatter={(value) => formatCompactPeso(Number(value))}
          />
          <Tooltip
            {...chartTheme.tooltip}
            formatter={(value) => formatPeso(Number(value))}
          />
          <ReferenceLine
            x={boundary}
            stroke="rgba(255, 255, 255, 0.18)"
            strokeDasharray="4 4"
            label={{
              value: "Forecast",
              position: "insideTopRight",
              fill: "#9a9a9a",
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke={chartTheme.line}
            strokeWidth={2}
            fill="url(#forecast-fill)"
            dot={false}
            activeDot={{ r: 4, fill: chartTheme.accent, stroke: "#111111" }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke={chartTheme.accent}
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4, fill: chartTheme.accent, stroke: "#111111" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
