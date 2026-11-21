import type { ReactNode } from "react";
import { Card } from "./Card";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  hoverable?: boolean;
  children: ReactNode;
};

export function ChartCard({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  hoverable = true,
  children,
}: ChartCardProps) {
  return (
    <Card className={`flex flex-col ${className}`} hoverable={hoverable}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-medium tracking-wide text-white">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className={`mt-4 min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </Card>
  );
}
