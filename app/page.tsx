export const instant = false;

import { OverviewView } from "@/components/overview/OverviewView";
import { getAnalytics } from "@/lib/analytics";

export default async function OverviewPage() {
  const { overviewByPeriod } = await getAnalytics();
  return <OverviewView data={overviewByPeriod} />;
}
