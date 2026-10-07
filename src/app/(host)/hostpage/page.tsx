import { redirect } from "next/navigation";
import { HostDashboard } from "@/components/host/HostDashboard";
import { isAuthenticated } from "@/lib/auth";
import { getAdminSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * Host panel. The middleware already rejects requests without a valid cookie;
 * here we additionally verify the token version against the database.
 */
export default async function HostPage() {
  if (!(await isAuthenticated())) redirect("/hostpagepass");
  const snapshot = await getAdminSnapshot();
  return <HostDashboard initial={snapshot} />;
}
