import { Suspense } from "react";
import { DataTablesView } from "@/components/data/DataTablesView";
import { fallbackTables } from "@/lib/data";

export default function DataTablesPage() {
  return (
    <Suspense
      fallback={<div className="h-64 animate-pulse rounded-2xl border border-line bg-surface/60" />}
    >
      <DataTablesView initialTables={fallbackTables} />
    </Suspense>
  );
}
