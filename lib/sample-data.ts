const DAY_MS = 86_400_000;

export type CustomerType = "Local" | "Domestic" | "International";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export type Customer = {
  customer_id: number;
  full_name: string;
  email: string;
  city: string;
  country: string;
  customer_type: CustomerType;
  created_at: string;
};

export type DivePackage = {
  package_id: number;
  package_name: string;
  category: string;
  price_php: number;
  duration_hours: number;
  difficulty: Difficulty;
  active: boolean;
};

export type Campaign = {
  campaign_id: number;
  campaign_name: string;
  channel: string;
  start_date: string;
  end_date: string;
  budget_php: number;
  target_country: string;
};

export type Sale = {
  sale_id: number;
  customer_id: number;
  package_id: number;
  campaign_id: number;
  sale_date: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  booking_channel: string;
};

export type Transaction = {
  transaction_id: number;
  sale_id: number;
  payment_date: string;
  payment_method: string;
  amount_paid: number;
  status: PaymentStatus;
};

function seeded(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(20_261_031);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(items: readonly T[]) => items[int(0, items.length - 1)];
const iso = (date: Date) => date.toISOString().slice(0, 10);
const between = (start: string, end: string) =>
  iso(new Date(Date.parse(start) + rand() * (Date.parse(end) - Date.parse(start))));
const addDays = (date: string, days: number) => iso(new Date(Date.parse(date) + days * DAY_MS));
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

const FIRST_NAMES = [
  "Maria", "James", "Aya", "Paolo", "Sofia", "Liam", "Chen", "Elena", "Noah", "Hannah",
  "Miguel", "Isabella", "Kenji", "Emma", "Lucas", "Olivia", "Rafael", "Camille", "Daniel", "Grace",
] as const;
const LAST_NAMES = [
  "Lopez", "Carter", "Tanaka", "Reyes", "Müller", "O'Brien", "Wei", "Cruz", "Santos", "Kim",
  "Garcia", "Lim", "Sato", "Brown", "Silva", "Nguyen", "Mendoza", "Torres", "Park", "Villanueva",
] as const;
const LOCAL_CITIES = ["Lapu-Lapu City", "Cebu City", "Mandaue City", "Talisay City", "Consolacion", "Cordova"] as const;
const OVERSEAS = [
  { city: "Tokyo", country: "Japan" },
  { city: "Seoul", country: "South Korea" },
  { city: "San Francisco", country: "United States" },
  { city: "Sydney", country: "Australia" },
  { city: "Munich", country: "Germany" },
  { city: "London", country: "United Kingdom" },
  { city: "Singapore", country: "Singapore" },
  { city: "Shanghai", country: "China" },
] as const;
const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com"] as const;

export const customers: Customer[] = Array.from({ length: 60 }, (_, index) => {
  const id = index + 1;
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const overseas = int(0, 9) < 4;
  const place = overseas ? pick(OVERSEAS) : { city: pick(LOCAL_CITIES), country: "Philippines" };
  const type: CustomerType = overseas
    ? "International"
    : place.city === "Lapu-Lapu City" || place.city === "Cordova" || place.city === "Consolacion"
      ? "Local"
      : "Domestic";

  return {
    customer_id: id,
    full_name: `${first} ${last}`,
    email: `${first}.${last}${id}@${pick(EMAIL_DOMAINS)}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9.@]/g, ""),
    city: place.city,
    country: place.country,
    customer_type: type,
    created_at: between("2024-01-05", "2026-10-20"),
  };
});

const PACKAGE_TYPES = [
  { name: "Fun Dive", base: 3_200, hours: 5, difficulty: "Beginner" },
  { name: "Discover Scuba", base: 4_500, hours: 6, difficulty: "Beginner" },
  { name: "Open Water Course", base: 18_000, hours: 24, difficulty: "Beginner" },
  { name: "Advanced Course", base: 15_500, hours: 20, difficulty: "Intermediate" },
  { name: "Rescue Course", base: 21_000, hours: 30, difficulty: "Advanced" },
  { name: "Specialty Course", base: 11_500, hours: 16, difficulty: "Intermediate" },
  { name: "Island Safari", base: 6_500, hours: 8, difficulty: "Beginner" },
  { name: "Night Dive", base: 3_800, hours: 4, difficulty: "Intermediate" },
  { name: "Private Charter", base: 24_000, hours: 10, difficulty: "Advanced" },
] as const satisfies readonly { name: string; base: number; hours: number; difficulty: Difficulty }[];
const SITES = ["House Reef", "Hilutungan", "Nalusuan", "Olango", "Talisay Point", "Marine Sanctuary"] as const;

export const divePackages: DivePackage[] = PACKAGE_TYPES.flatMap((type, typeIndex) =>
  SITES.map((site, siteIndex) => ({
    package_id: typeIndex * SITES.length + siteIndex + 1,
    package_name: `${type.name} – ${site}`,
    category: type.name,
    price_php: roundTo(type.base + siteIndex * 250 + int(0, 4) * 100, 100),
    duration_hours: type.hours + (siteIndex % 2),
    difficulty: type.difficulty,
    active: (typeIndex * SITES.length + siteIndex) % 13 !== 0,
  })),
);

const CHANNELS = ["Google Ads", "Facebook", "Instagram", "Email", "Travel Fair", "Klook", "Dive Show", "Referral"] as const;
const THEMES = [
  "Early Bird", "Dry Season", "Summer Splash", "Weekend Escape", "Certification Push",
  "Island Safari", "Holiday Gift", "Rainy Day Deal", "Peak Season", "Loyalty",
] as const;
const TARGET_COUNTRIES = [
  "Philippines", "United States", "Japan", "South Korea", "Germany", "Australia", "China", "United Kingdom",
] as const;
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export const campaigns: Campaign[] = Array.from({ length: 54 }, (_, index) => {
  const channel = CHANNELS[index % CHANNELS.length];
  const theme = THEMES[index % THEMES.length];
  // One campaign starts every 14 days from Nov 2024 and runs 2-5 weeks, so every date is covered.
  const start = new Date(Date.UTC(2024, 10, 1 + index * 14));
  const startDate = iso(start);

  return {
    campaign_id: index + 1,
    campaign_name: `${theme} ${channel} · ${monthYear.format(start)}`,
    channel,
    start_date: startDate,
    end_date: addDays(startDate, int(2, 5) * 7),
    budget_php: roundTo(int(20_000, 140_000), 1_000),
    target_country: pick(TARGET_COUNTRIES),
  };
});

const BOOKING_CHANNELS = ["Website", "Walk-in", "Klook", "Travel Agency", "Phone", "Facebook"] as const;
const PACKAGE_WEIGHTS = [0, 0, 1, 2, 2, 3, 4, 5, 6, 6, 6, 7, 8] as const;
// Sunday through Saturday. Weekends carry most dive bookings.
const WEEKDAY_WEIGHT = [1.45, 0.78, 0.75, 0.82, 1.05, 1.4, 1.6];
// January through December. The dry season (November to May) is busier.
const MONTH_WEIGHT = [1.18, 1.22, 1.26, 1.2, 1.08, 0.9, 0.84, 0.86, 0.92, 0.98, 1.08, 1.2];

const SALES_START = "2024-11-01";
const SALES_END = "2026-10-31";

// Picks a date with weekend, dry-season, and slow business growth weighting.
function weightedSaleDate() {
  const span = Date.parse(SALES_END) - Date.parse(SALES_START);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const date = between(SALES_START, SALES_END);
    const day = new Date(`${date}T00:00:00Z`);
    const growth = 0.82 + 0.36 * ((Date.parse(date) - Date.parse(SALES_START)) / span);
    const chance =
      (MONTH_WEIGHT[day.getUTCMonth()] / 1.3) *
      (WEEKDAY_WEIGHT[day.getUTCDay()] / 1.65) *
      (growth / 1.18);
    if (rand() < chance) return date;
  }
  return between(SALES_START, SALES_END);
}

function campaignOn(date: string) {
  const active = campaigns.filter((item) => item.start_date <= date && date <= item.end_date);
  return active.length > 0 ? pick(active) : campaigns[campaigns.length - 1];
}

// Sales are created first without ids, then sorted by date so sale_id follows the calendar.
export const sales: Sale[] = Array.from({ length: 400 }, () => {
  const saleDate = weightedSaleDate();
  const campaign = campaignOn(saleDate);
  const customer = pick(customers);
  const typeIndex = pick(PACKAGE_WEIGHTS);
  const pkg = divePackages[typeIndex * SITES.length + int(0, SITES.length - 1)];
  const quantity = typeIndex <= 5 ? int(1, 2) : int(1, 4);

  return {
    customer_id: customer.customer_id,
    package_id: pkg.package_id,
    campaign_id: campaign.campaign_id,
    sale_date: saleDate,
    quantity,
    unit_price: pkg.price_php,
    total_amount: quantity * pkg.price_php,
    booking_channel: pick(BOOKING_CHANNELS),
  };
})
  .sort((left, right) => left.sale_date.localeCompare(right.sale_date))
  .map((row, index) => ({ sale_id: index + 1, ...row }));

const PAYMENT_METHODS = ["GCash", "Maya", "Credit Card", "Bank Transfer", "Cash"] as const;

export const transactions: Transaction[] = sales.map((sale, index) => {
  const roll = rand();
  const status: PaymentStatus = roll < 0.82 ? "Paid" : roll < 0.94 ? "Pending" : "Refunded";

  return {
    transaction_id: index + 1,
    sale_id: sale.sale_id,
    payment_date: addDays(sale.sale_date, int(0, 2)),
    payment_method: pick(PAYMENT_METHODS),
    amount_paid: status === "Pending" ? 0 : sale.total_amount,
    status,
  };
});

export const customerById = new Map(customers.map((row) => [row.customer_id, row]));
export const packageById = new Map(divePackages.map((row) => [row.package_id, row]));
export const campaignById = new Map(campaigns.map((row) => [row.campaign_id, row]));
export const saleById = new Map(sales.map((row) => [row.sale_id, row]));

