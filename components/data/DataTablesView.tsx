"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Search, X } from "lucide-react";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { formatPeso } from "@/lib/format";
import type { Cell, TableKey, TableRow, Tables, TableSource } from "@/lib/data";

type Format = "peso" | "date" | "active" | "type" | "status";
type Column = { key: string; label: string; align?: "right"; format?: Format };
type TableConfig = { key: TableKey; label: string; columns: Column[]; minWidth: string };

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const TABLES: TableConfig[] = [
  {
    key: "customers",
    label: "Customers",
    minWidth: "min-w-[820px]",
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Customer" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "country", label: "Country" },
      { key: "type", label: "Type", format: "type" },
      { key: "joined", label: "Joined", format: "date" },
    ],
  },
  {
    key: "packages",
    label: "Dive packages",
    minWidth: "min-w-[780px]",
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Package" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price", align: "right", format: "peso" },
      { key: "hours", label: "Hours", align: "right" },
      { key: "difficulty", label: "Difficulty" },
      { key: "active", label: "Status", format: "active" },
    ],
  },
  {
    key: "campaigns",
    label: "Campaigns",
    minWidth: "min-w-[880px]",
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Campaign" },
      { key: "channel", label: "Channel" },
      { key: "start", label: "Start", format: "date" },
      { key: "end", label: "End", format: "date" },
      { key: "budget", label: "Budget", align: "right", format: "peso" },
      { key: "target", label: "Target" },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    minWidth: "min-w-[1080px]",
    columns: [
      { key: "id", label: "ID" },
      { key: "customer", label: "Customer" },
      { key: "package", label: "Package" },
      { key: "campaign", label: "Campaign" },
      { key: "date", label: "Date", format: "date" },
      { key: "quantity", label: "Qty", align: "right" },
      { key: "price", label: "Unit price", align: "right", format: "peso" },
      { key: "total", label: "Total", align: "right", format: "peso" },
      { key: "channel", label: "Booking channel" },
    ],
  },
  {
    key: "transactions",
    label: "Transactions",
    minWidth: "min-w-[820px]",
    columns: [
      { key: "id", label: "ID" },
      { key: "sale", label: "Sale" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Payment date", format: "date" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", align: "right", format: "peso" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
];

const TONES: Record<string, string> = {
  International: "bg-accent/10 text-accent",
  Local: "bg-white/[0.05] text-white/70",
  Domestic: "bg-white/[0.05] text-white/70",
  Active: "bg-positive/10 text-positive",
  Inactive: "bg-white/[0.05] text-muted",
  Paid: "bg-positive/10 text-positive",
  Pending: "bg-amber-400/10 text-amber-400",
  Refunded: "bg-negative/10 text-negative",
};

function Badge({ label }: { label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] ${TONES[label] ?? "bg-white/[0.05] text-muted"}`}>
      {label}
    </span>
  );
}

function renderCell(value: Cell, format?: Format) {
  if (format === "peso") return formatPeso(Number(value));
  if (format === "date") return dateFmt.format(new Date(String(value).slice(0, 10)));
  if (format === "active") return <Badge label={value ? "Active" : "Inactive"} />;
  if (format === "type" || format === "status") return <Badge label={String(value)} />;
  return String(value);
}

export function DataTablesView({ initialTables }: { initialTables: Tables }) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlTable = searchParams.get("table");
  const [tables, setTables] = useState<Tables>(initialTables);
  const [sources, setSources] = useState<Partial<Record<TableKey, TableSource>>>({});
  const [tableKey, setTableKey] = useState<TableKey>(
    () => TABLES.find((item) => item.key === urlTable)?.key ?? "customers",
  );
  const [query, setQuery] = useState(urlQuery);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const match = TABLES.find((item) => item.key === urlTable);
    if (match) {
      setTableKey(match.key);
      setSortKey("id");
      setSortDir("asc");
    }
  }, [urlTable]);

  useEffect(() => {
    const controller = new AbortController();
    const key = tableKey;

    async function load() {
      try {
        const response = await fetch(`/api/tables/${key}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Request failed");
        const payload = (await response.json()) as { rows?: unknown; source?: unknown };
        if (!Array.isArray(payload.rows)) throw new Error("Unexpected response");

        setTables((current) => ({ ...current, [key]: payload.rows as TableRow[] }));
        setSources((current) => ({
          ...current,
          [key]: payload.source === "mysql" ? "mysql" : "sample",
        }));
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setSources((current) => ({ ...current, [key]: "sample" }));
      }
    }

    load();
    return () => controller.abort();
  }, [tableKey]);

  const table = TABLES.find((item) => item.key === tableKey) ?? TABLES[0];
  const sourceRows = tables[table.key];
  const needle = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const filtered = needle
      ? sourceRows.filter((row) =>
          Object.values(row).some((value) => String(value).toLowerCase().includes(needle)),
        )
      : sourceRows;

    return [...filtered].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sortDir === "asc" ? result : -result;
    });
  }, [sourceRows, needle, sortKey, sortDir]);

  const source = sources[table.key];
  const sourceLabel =
    source === "mysql"
      ? "Live MySQL data"
      : source === "sample"
        ? "Local sample data"
        : "Checking database…";
  const sourceColor =
    source === "mysql" ? "bg-positive" : source === "sample" ? "bg-amber-400" : "bg-white/30";

  function selectTable(key: TableKey) {
    setTableKey(key);
    setSortKey("id");
    setSortDir("asc");
  }

  function sortBy(key: string) {
    if (key === sortKey) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function exportCsv() {
    const cell = (value: Cell) => `"${String(value).replace(/"/g, '""')}"`;
    const lines = [
      table.columns.map((column) => cell(column.label)),
      ...rows.map((row) => table.columns.map((column) => cell(row[column.key]))),
    ];
    const csv = lines.map((line) => line.join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${table.key}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Data foundation"
        title="Data tables"
        description="Five related tables that feed every chart in this dashboard. Search filters the active table; click any column header to sort."
        action={
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[10px] text-muted">
              50+ records per table
            </span>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rows.length === 0}
              className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-xs text-white transition duration-200 hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-40"
            >
              <Download size={14} aria-hidden="true" />
              Export CSV
            </button>
          </div>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Database tables"
            className="flex gap-1 overflow-x-auto pb-0.5"
          >
            {TABLES.map((item) => {
              const active = item.key === table.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTable(item.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs transition duration-200 ${
                    active
                      ? "border-white/10 bg-white/[0.08] text-white"
                      : "border-transparent text-muted hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] tabular-nums ${
                      active ? "bg-accent/15 text-accent" : "bg-white/[0.05] text-muted"
                    }`}
                  >
                    {tables[item.key].length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2 transition focus-within:border-white/20 lg:w-72">
            <Search size={14} className="shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="table-search" className="sr-only">
              Search {table.label.toLowerCase()}
            </label>
            <input
              id="table-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${table.label.toLowerCase()}`}
              className="w-full bg-transparent text-xs text-white placeholder:text-muted focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-muted transition hover:text-white"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="max-h-[560px] overflow-auto">
          <table className={`w-full ${table.minWidth} text-left text-xs`}>
            <caption className="sr-only">
              {table.label} table. {rows.length} records shown.
            </caption>
            <thead>
              <tr className="sticky top-0 z-10 border-b border-line bg-[#161616]">
                {table.columns.map((column) => {
                  const active = column.key === sortKey;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      className="whitespace-nowrap px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                    >
                      <button
                        type="button"
                        onClick={() => sortBy(column.key)}
                        className={`group flex w-full items-center gap-1 transition hover:text-white ${
                          column.align === "right" ? "justify-end" : ""
                        }`}
                      >
                        {column.label}
                        {active ? (
                          sortDir === "asc" ? (
                            <ArrowUp size={11} className="text-accent" aria-hidden="true" />
                          ) : (
                            <ArrowDown size={11} className="text-accent" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown
                            size={11}
                            className="opacity-0 transition group-hover:opacity-60"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={table.columns.length} className="px-4 py-12 text-center text-muted">
                    No records match “{query.trim()}”.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={String(row.id)} className="transition-colors hover:bg-white/[0.03]">
                    {table.columns.map((column) => (
                      <td
                        key={column.key}
                        className={`max-w-[280px] truncate whitespace-nowrap px-4 py-2.5 ${
                          column.align === "right"
                            ? "text-right tabular-nums text-white/85"
                            : "text-white/75"
                        } ${column.key === "id" ? "tabular-nums text-muted" : ""}`}
                      >
                        {renderCell(row[column.key], column.format)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[10px] text-muted">
          <span>
            Showing {rows.length} of {sourceRows.length} {table.label.toLowerCase()} records
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${sourceColor}`} />
            {sourceLabel}
          </span>
        </div>
      </Card>
    </div>
  );
}
