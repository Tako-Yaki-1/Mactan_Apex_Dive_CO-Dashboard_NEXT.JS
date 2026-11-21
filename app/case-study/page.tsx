export const instant = false;

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ChartColumn,
  Database,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { getAnalytics } from "@/lib/analytics";
import { getForecast } from "@/lib/forecast-data";
import { formatNumber, formatPeso } from "@/lib/format";

const fullDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const FACTS = [
  { label: "Founded", value: "2014" },
  { label: "Base", value: "Lapu-Lapu City, Mactan, Cebu" },
  { label: "Team", value: "12 staff, 3 dive boats" },
  { label: "Customers", value: "Local, domestic, international" },
];

const buildProcess = (forecastTotal: number) => [
  {
    href: "/descriptive",
    icon: ChartColumn,
    step: "1 · Descriptive",
    title: "What happened",
    text: "Revenue, bookings, and package mix across the selected period. Weekend demand and the August slowdown are the clearest patterns.",
  },
  {
    href: "/predictive",
    icon: TrendingUp,
    step: "2 · Predictive",
    title: "What will happen",
    text: `A three-month moving average with trend and dry-season adjustment projects ${formatPeso(forecastTotal)} for the next quarter.`,
  },
  {
    href: "/prescriptive",
    icon: Target,
    step: "3 · Prescriptive",
    title: "What we should do",
    text: "Three actions with expected impact: weekend campaign focus, a rebooking offer for Discover Scuba guests, and a low-season course bundle.",
  },
];

export default async function CaseStudyPage() {
  const [{ counts, earliestSaleDate, latestSaleDate }, forecast] = await Promise.all([
    getAnalytics(),
    getForecast(),
  ]);
  const process = buildProcess(forecast.total);

  const dataRows = [
    { table: "customers", records: counts.customers, purpose: "Customer profiles, location, and segment type" },
    { table: "dive_packages", records: counts.packages, purpose: "Package catalog with price, duration, and difficulty" },
    { table: "marketing_campaigns", records: counts.campaigns, purpose: "Channel, budget, run dates, and target market" },
    { table: "sales", records: counts.sales, purpose: "Bookings linked to a customer, package, and campaign" },
    { table: "transactions", records: counts.transactions, purpose: "Payment records linked to each sale" },
  ];

  const periodLabel = `${fullDateFmt.format(new Date(`${earliestSaleDate}T00:00:00Z`))} – ${fullDateFmt.format(
    new Date(`${latestSaleDate}T00:00:00Z`),
  )}`;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Final Project 2026 · Business Analytics"
        title="Case study: Mactan Apex Dive Co."
        description="How a dive operator in Mactan, Cebu used its own sales records to describe performance, forecast the next quarter, and choose what to do next."
        action={
          <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[10px] text-muted">
            Chapter 8 case flow · 2026
          </span>
        }
      />

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
              <Building2 size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            Company overview
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/75">
            Mactan Apex Dive Co. is a dive shop and tour operator based in Lapu-Lapu City, Mactan,
            Cebu. Founded in 2014, the company runs three dive boats and a team of twelve, offering
            fun dives, certification courses, island safaris, and private charters around
            Hilutungan, Nalusuan, Olango, and the marine sanctuary. Its customers are local
            residents, domestic travelers from Metro Cebu and Manila, and international divers from
            Japan, South Korea, the United States, and Europe.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-white/75">
            Bookings arrive through the website, walk-ins, Klook, travel agencies, phone calls, and
            Facebook. Each sale is linked to one customer, one dive package, and one marketing
            campaign, which makes it possible to trace revenue back to both the product and the
            promotion that produced it.
          </p>
        </Card>

        <Card>
          <h2 className="text-[13px] font-medium tracking-wide text-white">At a glance</h2>
          <p className="mt-0.5 text-xs text-muted">Company profile</p>
          <dl className="mt-5 space-y-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-3 text-[11px]">
                <dt className="text-muted">{fact.label}</dt>
                <dd className="max-w-[58%] text-right text-white/80">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/data"
            className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5 text-[11px] text-white/75 transition hover:border-white/15 hover:text-white"
          >
            View the dataset
            <ArrowRight size={13} className="text-accent" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
              <AlertTriangle size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            The business problem
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/75">
            Revenue moves with the diving season, but marketing spend and staffing are planned the
            same way all year. Management cannot tell which packages and campaigns actually drive
            bookings, so the shop is often overstaffed in slow months and short of guides in peak
            months. Without a forward view, campaign budgets are renewed by habit rather than
            evidence.
          </p>
          <ul className="mt-4 space-y-2 text-[11px] leading-relaxed text-muted">
            <li className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              Seasonal swings make monthly revenue hard to plan.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              Marketing spend is not tied to package or channel demand.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              Package performance and campaign return are not measured together.
            </li>
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
              <Target size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            Objective
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/75">
            Use the shop&apos;s transaction records to describe performance, forecast revenue for
            the next quarter, and recommend a campaign and package plan that lifts off-season demand
            while protecting peak-season capacity.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-white/[0.02] p-3">
              <p className="text-[10px] text-muted">Next-quarter forecast</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                {formatPeso(forecast.total)}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white/[0.02] p-3">
              <p className="text-[10px] text-muted">Expected bookings</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                {formatNumber(forecast.bookings)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <section aria-labelledby="process-heading" className="space-y-3 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-2 px-1">
          <div>
            <h2 id="process-heading" className="text-sm font-medium text-white">
              The analytics process
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Each step feeds the next, from evidence to forecast to decision.
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
            Descriptive → Predictive → Prescriptive
          </span>
        </div>

        <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
          {process.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-white/75">
                      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-white">{item.title}</h3>
                  <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-muted">{item.text}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-[11px] text-accent">
                    Open step
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="stagger grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden p-0 xl:col-span-2">
          <div className="flex items-center gap-2 p-5 pb-3 text-xs text-muted">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
              <Database size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            Data foundation
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-y border-line bg-white/[0.02] text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th scope="col" className="px-5 py-2.5 font-medium">Table</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium">Records</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {dataRows.map((row) => (
                  <tr key={row.table}>
                    <td className="px-5 py-2.5 font-medium text-white/85">{row.table}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums text-white/75">{row.records}</td>
                    <td className="px-5 py-2.5 text-muted">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-5 py-3 text-[10px] text-muted">
            Every table holds at least 50 records and all foreign keys point to real rows.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-white/[0.03] text-white/70">
              <Wrench size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
            Method and scope
          </div>
          <dl className="mt-4 space-y-3 text-[11px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Period</dt>
              <dd className="text-right text-white/80">{periodLabel}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Currency</dt>
              <dd className="text-right text-white/80">Philippine peso (PHP)</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Forecast method</dt>
              <dd className="text-right text-white/80">Moving average, trend, seasonality</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Tools</dt>
              <dd className="text-right text-white/80">Next.js, MySQL, Recharts</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
            The dataset is synthetic but internally consistent. Forecasts and uplift figures are
            planning estimates, not guarantees.
          </p>
        </Card>
      </div>
    </div>
  );
}
