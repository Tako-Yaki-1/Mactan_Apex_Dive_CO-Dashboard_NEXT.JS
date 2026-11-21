import { NextResponse } from "next/server";
import { getTable, TABLE_KEYS, type TableKey } from "@/lib/data";

export async function GET(_request: Request, context: RouteContext<"/api/tables/[table]">) {
  const { table } = await context.params;

  if (!TABLE_KEYS.includes(table as TableKey)) {
    return NextResponse.json(
      { error: `Unknown table. Use one of: ${TABLE_KEYS.join(", ")}.` },
      { status: 404 },
    );
  }

  const { rows, source } = await getTable(table as TableKey);
  return NextResponse.json({ table, source, count: rows.length, rows });
}
