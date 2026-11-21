"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-3 py-2 text-xs text-white transition duration-200 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <Printer size={14} aria-hidden="true" />
      Print rating sheet
    </button>
  );
}
