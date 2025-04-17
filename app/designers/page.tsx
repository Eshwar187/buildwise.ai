import { DesignersSearch } from "@/components/designers-search";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata = {
  title: "Find Designers | BuildWise.ai",
  description: "Find top-rated designers and architects in your area",
};

export default function DesignersPage() {
  return (
    <DashboardShell>
      <DesignersSearch />
    </DashboardShell>
  );
}
