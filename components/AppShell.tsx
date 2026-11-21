"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PeriodProvider } from "./PeriodContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <PeriodProvider>
      <div className="min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="lg:pl-[248px] print:pl-0">
          <TopBar onMenu={() => setOpen(true)} />
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 print:max-w-none print:p-0">
            <div key={pathname} className="page-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PeriodProvider>
  );
}
