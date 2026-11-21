import type { RowDataPacket } from "mysql2";
import { pool } from "./db";
import {
  campaignById,
  campaigns,
  customerById,
  customers,
  divePackages,
  packageById,
  saleById,
  sales,
  transactions,
} from "./sample-data";

export const TABLE_KEYS = ["customers", "packages", "campaigns", "sales", "transactions"] as const;
export type TableKey = (typeof TABLE_KEYS)[number];
export type Cell = string | number | boolean;
export type TableRow = Record<string, Cell>;
export type Tables = Record<TableKey, TableRow[]>;
export type TableSource = "mysql" | "sample";

export type RawTables = {
  customers: { customer_id: number; full_name: string }[];
  packages: { package_id: number; package_name: string; category: string }[];
  campaigns: { campaign_id: number }[];
  sales: { sale_id: number; customer_id: number; package_id: number; sale_date: string }[];
  transactions: {
    transaction_id: number;
    sale_id: number;
    payment_date: string;
    amount_paid: number;
    status: string;
  }[];
};

export const fallbackTables: Tables = {
  customers: customers.map((row) => ({
    id: row.customer_id,
    name: row.full_name,
    email: row.email,
    city: row.city,
    country: row.country,
    type: row.customer_type,
    joined: row.created_at,
  })),
  packages: divePackages.map((row) => ({
    id: row.package_id,
    name: row.package_name,
    category: row.category,
    price: row.price_php,
    hours: row.duration_hours,
    difficulty: row.difficulty,
    active: row.active,
  })),
  campaigns: campaigns.map((row) => ({
    id: row.campaign_id,
    name: row.campaign_name,
    channel: row.channel,
    start: row.start_date,
    end: row.end_date,
    budget: row.budget_php,
    target: row.target_country,
  })),
  sales: sales.map((row) => ({
    id: row.sale_id,
    customer: customerById.get(row.customer_id)?.full_name ?? "—",
    package: packageById.get(row.package_id)?.package_name ?? "—",
    campaign: campaignById.get(row.campaign_id)?.campaign_name ?? "—",
    date: row.sale_date,
    quantity: row.quantity,
    price: row.unit_price,
    total: row.total_amount,
    channel: row.booking_channel,
  })),
  transactions: transactions.map((row) => {
    const sale = saleById.get(row.sale_id);
    return {
      id: row.transaction_id,
      sale: `#${row.sale_id}`,
      customer: sale ? (customerById.get(sale.customer_id)?.full_name ?? "—") : "—",
      date: row.payment_date,
      method: row.payment_method,
      amount: row.amount_paid,
      status: row.status,
    };
  }),
};

const QUERIES: Record<TableKey, string> = {
  customers: `
    SELECT customer_id AS id, full_name AS name, email, city, country,
           customer_type AS type, created_at AS joined
    FROM customers
    ORDER BY customer_id`,
  packages: `
    SELECT package_id AS id, package_name AS name, category, price_php AS price,
           duration_hours AS hours, difficulty, active
    FROM dive_packages
    ORDER BY package_id`,
  campaigns: `
    SELECT campaign_id AS id, campaign_name AS name, channel, start_date AS \`start\`,
           end_date AS \`end\`, budget_php AS budget, target_country AS target
    FROM marketing_campaigns
    ORDER BY campaign_id`,
  sales: `
    SELECT s.sale_id AS id, c.full_name AS customer, p.package_name AS package,
           m.campaign_name AS campaign, s.sale_date AS date, s.quantity,
           s.unit_price AS price, s.total_amount AS total, s.booking_channel AS channel
    FROM sales s
    JOIN customers c ON c.customer_id = s.customer_id
    JOIN dive_packages p ON p.package_id = s.package_id
    JOIN marketing_campaigns m ON m.campaign_id = s.campaign_id
    ORDER BY s.sale_id`,
  transactions: `
    SELECT t.transaction_id AS id, CONCAT('#', t.sale_id) AS sale, c.full_name AS customer,
           t.payment_date AS date, t.payment_method AS method,
           t.amount_paid AS amount, t.status
    FROM transactions t
    JOIN sales s ON s.sale_id = t.sale_id
    JOIN customers c ON c.customer_id = s.customer_id
    ORDER BY t.transaction_id`,
};

const NUMERIC_FIELDS: Record<TableKey, string[]> = {
  customers: ["id"],
  packages: ["id", "price", "hours"],
  campaigns: ["id", "budget"],
  sales: ["id", "quantity", "price", "total"],
  transactions: ["id", "amount"],
};

function normalize(key: TableKey, rows: RowDataPacket[]): TableRow[] {
  return rows.map((row) => {
    const next = { ...row } as TableRow;
    for (const field of NUMERIC_FIELDS[key]) next[field] = Number(next[field]);
    if (key === "packages") next.active = Boolean(next.active);
    return next;
  });
}

export async function getTable(key: TableKey): Promise<{ rows: TableRow[]; source: TableSource }> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(QUERIES[key]);
    return { rows: normalize(key, rows), source: "mysql" };
  } catch {
    return { rows: fallbackTables[key], source: "sample" };
  }
}

const RAW_QUERIES = {
  customers: "SELECT customer_id, full_name FROM customers ORDER BY customer_id",
  packages: "SELECT package_id, package_name, category FROM dive_packages ORDER BY package_id",
  campaigns: "SELECT campaign_id FROM marketing_campaigns ORDER BY campaign_id",
  sales: "SELECT sale_id, customer_id, package_id, sale_date FROM sales ORDER BY sale_id",
  transactions:
    "SELECT transaction_id, sale_id, payment_date, amount_paid, status FROM transactions ORDER BY transaction_id",
} as const;

export async function getRawTables(): Promise<{ tables: RawTables; source: TableSource }> {
  try {
    const [customerRows, packageRows, campaignRows, saleRows, transactionRows] = await Promise.all([
      pool.query<RowDataPacket[]>(RAW_QUERIES.customers),
      pool.query<RowDataPacket[]>(RAW_QUERIES.packages),
      pool.query<RowDataPacket[]>(RAW_QUERIES.campaigns),
      pool.query<RowDataPacket[]>(RAW_QUERIES.sales),
      pool.query<RowDataPacket[]>(RAW_QUERIES.transactions),
    ]);

    return {
      tables: {
        customers: customerRows[0].map((row) => ({
          customer_id: Number(row.customer_id),
          full_name: String(row.full_name),
        })),
        packages: packageRows[0].map((row) => ({
          package_id: Number(row.package_id),
          package_name: String(row.package_name),
          category: String(row.category),
        })),
        campaigns: campaignRows[0].map((row) => ({ campaign_id: Number(row.campaign_id) })),
        sales: saleRows[0].map((row) => ({
          sale_id: Number(row.sale_id),
          customer_id: Number(row.customer_id),
          package_id: Number(row.package_id),
          sale_date: String(row.sale_date),
        })),
        transactions: transactionRows[0].map((row) => ({
          transaction_id: Number(row.transaction_id),
          sale_id: Number(row.sale_id),
          payment_date: String(row.payment_date),
          amount_paid: Number(row.amount_paid),
          status: String(row.status),
        })),
      },
      source: "mysql",
    };
  } catch {
    return {
      tables: {
        customers,
        packages: divePackages,
        campaigns,
        sales,
        transactions,
      },
      source: "sample",
    };
  }
}
