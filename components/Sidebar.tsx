"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Aperture,
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  LayoutDashboard,
  Table2,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

const groups = [
  {
    label: "Analytics",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
      { href: "/descriptive", label: "Descriptive", icon: ChartColumn },
      { href: "/predictive", label: "Predictive", icon: TrendingUp },
      { href: "/prescriptive", label: "Prescriptive", icon: Target },
    ],
  },
  {
    label: "Data",
    items: [{ href: "/data", label: "Data Tables", icon: Table2 }],
  },
  {
    label: "Project",
    items: [
      { href: "/case-study", label: "Case Study", icon: BookOpen },
      { href: "/rating-sheet", label: "Rating Sheet", icon: ClipboardCheck },
    ],
  },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden print:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col gap-7 border-r border-line bg-base/95 p-4 transition-transform duration-300 lg:translate-x-0 print:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-1" onClick={onClose}>
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-white shadow-[0_0_30px_rgba(255,74,28,0.35)]">
              <Aperture size={20} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-tight">Mactan Apex</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">Dive Co.</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-white/[0.06] hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted/70">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition duration-200 ${
                        active
                          ? "bg-white/[0.08] text-white"
                          : "text-muted hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className={active ? "text-accent" : "text-muted group-hover:text-white"}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                      {active ? <span className="ml-auto size-1.5 rounded-full bg-accent" /> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="rounded-2xl border border-line bg-elevated/70 p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Final Project 2026
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/75">
            Business analytics case study for a dive shop in Mactan, Cebu.
          </p>
        </div>
      </aside>
    </>
  );
}
