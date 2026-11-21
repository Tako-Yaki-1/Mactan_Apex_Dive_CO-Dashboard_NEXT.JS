import Link from "next/link";
import { Waves } from "lucide-react";
import { formatNumber, formatPeso } from "@/lib/format";

type ActivityItem = {
  name: string;
  package: string;
  amount: number;
  date: string;
};

export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-xs text-muted">No transactions in this period.</p>;
  }

  return (
    <div className="divide-y divide-line">
      {items.map((item) => (
        <Link
          key={`${item.name}-${item.date}`}
          href={`/data?table=customers&q=${encodeURIComponent(item.name)}`}
          className="flex items-center gap-3 rounded-lg py-2.5 transition first:pt-0 last:pb-0 hover:bg-white/[0.03]"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-white/[0.03] text-white/60">
            <Waves size={14} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">{item.name}</p>
            <p className="truncate text-[11px] text-muted">
              {item.package} · {item.date}
            </p>
          </div>
          <p className="shrink-0 text-xs tabular-nums text-white/85">{formatPeso(item.amount)}</p>
        </Link>
      ))}
    </div>
  );
}

type PackageItem = { name: string; revenue: number; percent: number };

export function PackageBars({ items }: { items: PackageItem[] }) {
  const max = items[0]?.revenue || 1;

  return (
    <div className="space-y-3.5">
      {items.map((item, index) => (
        <Link
          key={item.name}
          href={`/data?table=sales&q=${encodeURIComponent(item.name)}`}
          className="block rounded-lg transition hover:bg-white/[0.03]"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-xs text-white/85">
              <span className="mr-2 text-[10px] tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.name}
            </p>
            <p className="shrink-0 text-[11px] tabular-nums text-muted">{formatPeso(item.revenue)}</p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className={`h-full rounded-full ${index === 0 ? "bg-accent" : "bg-white/20"}`}
              style={{ width: `${(item.revenue / max) * 100}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

type HeatmapMonth = { label: string; values: number[] };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Heatmap({ months }: { months: HeatmapMonth[] }) {
  const max = Math.max(...months.flatMap((month) => month.values));

  return (
    <div role="img" aria-label="Booking heatmap by weekday and month. Peak days are highlighted in orange.">
      <div className="grid grid-cols-[2.1rem_repeat(7,1fr)] gap-1">
        <span />
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-center text-[9px] uppercase tracking-wider text-muted/70">
            {day.slice(0, 1)}
          </span>
        ))}

        {months.map((month) => (
          <div key={month.label} className="contents">
            <span className="self-center text-[10px] text-muted">{month.label}</span>
            {month.values.map((value, index) => {
              const ratio = max ? value / max : 0;
              return (
                <div
                  key={`${month.label}-${WEEKDAYS[index]}`}
                  title={`${month.label} · ${WEEKDAYS[index]}: ${formatNumber(value)} bookings`}
                  className="aspect-square rounded-[4px]"
                  style={{
                    backgroundColor:
                      ratio > 0.84
                        ? "rgba(255, 74, 28, 0.9)"
                        : `rgba(255, 255, 255, ${0.04 + ratio * 0.16})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-muted">
        <span>Lower demand</span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-[2px] bg-white/[0.06]" />
          <span className="size-2 rounded-[2px] bg-white/[0.12]" />
          <span className="size-2 rounded-[2px] bg-white/[0.18]" />
          <span className="size-2 rounded-[2px] bg-accent" />
        </span>
        <span>Peak</span>
      </div>
    </div>
  );
}
