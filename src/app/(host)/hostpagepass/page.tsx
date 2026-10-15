import { redirect } from "next/navigation";
import { LoginForm } from "@/components/host/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HostLoginPage() {
  if (await isAuthenticated()) redirect("/hostpage");
  const { media } = await getSiteContent();
  return <LoginForm logo={media.logo} />;
}
