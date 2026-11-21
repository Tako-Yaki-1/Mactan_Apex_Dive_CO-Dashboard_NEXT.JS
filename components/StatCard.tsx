import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
          <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span>{label}</span>
      </div>
      <p className="mt-4 text-xl font-semibold leading-tight tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-[10px] leading-relaxed text-muted">{hint}</p> : null}
    </Card>
  );
}
