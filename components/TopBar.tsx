"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarDays, Check, ChevronRight, Menu, Search } from "lucide-react";
import { PERIODS, usePeriod } from "./PeriodContext";
import type { Period } from "@/lib/period";

const TITLES: Record<string, string> = {
  "/": "Overview",
  "/descriptive": "Descriptive",
  "/predictive": "Predictive",
  "/prescriptive": "Prescriptive",
  "/data": "Data Tables",
  "/case-study": "Case Study",
  "/rating-sheet": "Rating Sheet",
};

type Notice = { id: string; title: string; text: string; href: string };
type Suggestion = { table: string; label: string; detail: string };

const SEARCH_SOURCES = [
  { table: "customers", kind: "Customer", field: "city" },
  { table: "packages", kind: "Package", field: "category" },
  { table: "campaigns", kind: "Campaign", field: "channel" },
] as const;

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { period, setPeriod } = usePeriod();
  const title = TITLES[pathname] ?? "Overview";
  const showPeriod = pathname === "/" || pathname === "/descriptive";

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [index, setIndex] = useState<Suggestion[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((payload: { items?: Notice[] }) => setNotices(payload.items ?? []))
      .catch(() => setNotices([]));
  }, []);

  useEffect(() => {
    setBellOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setBellOpen(false);
        setFocused(false);
        setMobileSearch(false);
      }
    }
    function onPointerDown(event: MouseEvent) {
      const node = event.target as Node;
      if (bellRef.current && !bellRef.current.contains(node)) setBellOpen(false);
      if (searchRef.current && !searchRef.current.contains(node)) setFocused(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  async function loadIndex() {
    if (index.length > 0) return;
    const lists = await Promise.all(
      SEARCH_SOURCES.map(async (source) => {
        try {
          const response = await fetch(`/api/tables/${source.table}`);
          const payload = (await response.json()) as {
            rows?: Record<string, string | number | boolean>[];
          };
          return (payload.rows ?? []).map((row) => ({
            table: source.table,
            label: String(row.name),
            detail: `${source.kind} · ${String(row[source.field])}`,
          }));
        } catch {
          return [];
        }
      }),
    );
    setIndex(lists.flat());
  }

  const needle = query.trim().toLowerCase();
  const suggestions = useMemo(
    () => (needle ? index.filter((item) => item.label.toLowerCase().includes(needle)).slice(0, 5) : []),
    [index, needle],
  );
  const unread = notices.filter((notice) => !read.includes(notice.id)).length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/data?q=${encodeURIComponent(value)}` : "/data");
    setFocused(false);
    setMobileSearch(false);
  }

  function choose(item: Suggestion) {
    router.push(`/data?table=${item.table}&q=${encodeURIComponent(item.label)}`);
    setQuery("");
    setFocused(false);
    setMobileSearch(false);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-base/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8 print:hidden">
      <button
        type="button"
        onClick={onMenu}
        className="grid size-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-muted transition hover:text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={17} aria-hidden="true" />
      </button>

      <div className="hidden items-center gap-2 text-xs sm:flex">
        <span className="text-muted">Dashboard</span>
        <ChevronRight size={13} className="text-white/25" aria-hidden="true" />
        <span className="font-medium text-white">{title}</span>
      </div>

      <div
        ref={searchRef}
        className={`${
          mobileSearch
            ? "absolute inset-x-0 top-full flex border-b border-line bg-base/95 p-3 backdrop-blur-xl"
            : "hidden"
        } md:relative md:ml-auto md:flex md:w-full md:max-w-sm md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none`}
      >
        <form
          onSubmit={submit}
          className="flex w-full items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2 transition focus-within:border-white/20"
        >
          <Search size={15} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              setFocused(true);
              void loadIndex();
            }}
            type="search"
            autoComplete="off"
            placeholder="Search customers, packages, campaigns"
            aria-label="Search records"
            className="w-full bg-transparent text-xs text-white placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[10px] text-muted lg:block">
            /
          </kbd>
        </form>

        {focused && suggestions.length > 0 ? (
          <ul
            role="listbox"
            aria-label="Search suggestions"
            className="page-in absolute inset-x-0 top-full mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
          >
            {suggestions.map((item) => (
              <li key={`${item.table}-${item.label}`} role="option" aria-selected="false">
                <button
                  type="button"
                  onClick={() => choose(item)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.05]"
                >
                  <span className="truncate text-xs text-white">{item.label}</span>
                  <span className="shrink-0 text-[10px] text-muted">{item.detail}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <button
          type="button"
          onClick={() => setMobileSearch((open) => !open)}
          aria-label="Search records"
          aria-expanded={mobileSearch}
          className="grid size-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-muted transition hover:text-white md:hidden"
        >
          <Search size={16} aria-hidden="true" />
        </button>

        {showPeriod ? (
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2">
            <CalendarDays size={15} className="text-muted" aria-hidden="true" />
            <label htmlFor="period" className="sr-only">
              Reporting period
            </label>
            <select
              id="period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
              className="cursor-pointer appearance-none bg-transparent pr-1 text-xs text-white focus:outline-none [&>option]:bg-surface"
            >
              {PERIODS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div ref={bellRef} className="relative">
          <button
            type="button"
            onClick={() => setBellOpen((open) => !open)}
            aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
            aria-expanded={bellOpen}
            className="relative grid size-9 place-items-center rounded-xl border border-line bg-white/[0.03] text-muted transition hover:text-white"
          >
            <Bell size={16} aria-hidden="true" />
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                {unread}
              </span>
            ) : null}
          </button>

          {bellOpen ? (
            <div className="page-in absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-xs font-medium text-white">Notifications</p>
                <button
                  type="button"
                  onClick={() => setRead(notices.map((notice) => notice.id))}
                  disabled={unread === 0}
                  className="flex items-center gap-1 text-[10px] text-muted transition hover:text-white disabled:opacity-40"
                >
                  <Check size={11} aria-hidden="true" />
                  Mark all as read
                </button>
              </div>

              {notices.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-muted">No notifications right now.</p>
              ) : (
                <ul className="max-h-80 divide-y divide-line overflow-y-auto">
                  {notices.map((notice) => {
                    const isRead = read.includes(notice.id);
                    return (
                      <li key={notice.id}>
                        <Link
                          href={notice.href}
                          onClick={() => {
                            setRead((current) => (current.includes(notice.id) ? current : [...current, notice.id]));
                            setBellOpen(false);
                          }}
                          className="flex gap-3 px-4 py-3 transition hover:bg-white/[0.04]"
                        >
                          <span
                            className={`mt-1.5 size-1.5 shrink-0 rounded-full ${isRead ? "bg-transparent" : "bg-accent"}`}
                          />
                          <span className="min-w-0">
                            <span className={`block text-xs ${isRead ? "text-white/60" : "font-medium text-white"}`}>
                              {notice.title}
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                              {notice.text}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
