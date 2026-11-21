import Link from "next/link";
import { ChevronRight } from "lucide-react";

const STEPS = [
  { key: "descriptive", href: "/descriptive", label: "Descriptive", note: "What happened" },
  { key: "predictive", href: "/predictive", label: "Predictive", note: "What will happen" },
  { key: "prescriptive", href: "/prescriptive", label: "Prescriptive", note: "What we should do" },
] as const;

export type FlowStep = (typeof STEPS)[number]["key"];

export function FlowStrip({ current }: { current: FlowStep }) {
  return (
    <nav
      aria-label="Business analytics process"
      className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 rounded-2xl border border-line bg-surface/60 p-1.5 backdrop-blur-md"
    >
      {STEPS.map((step, index) => {
        const active = step.key === current;
        return (
          <div key={step.key} className="contents">
            <Link
              href={step.href}
              aria-current={active ? "step" : undefined}
              className={`flex min-w-0 items-center gap-2 rounded-xl border px-2 py-2 transition duration-200 sm:px-3 ${
                active
                  ? "border-accent/25 bg-accent/[0.07] text-white"
                  : "border-transparent text-muted hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                  active ? "bg-accent text-white" : "bg-white/[0.06] text-white/60"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">{step.label}</span>
                <span className="hidden truncate text-[10px] text-muted sm:block">{step.note}</span>
              </span>
            </Link>
            {index < STEPS.length - 1 ? (
              <ChevronRight size={13} className="text-white/20" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
