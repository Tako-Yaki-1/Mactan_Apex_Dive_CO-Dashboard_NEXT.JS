export const instant = false;

import { DescriptiveView } from "@/components/descriptive/DescriptiveView";
import { getAnalytics } from "@/lib/analytics";

export default async function DescriptivePage() {
  const { overviewByPeriod } = await getAnalytics();
  return <DescriptiveView data={overviewByPeriod} />;
}
