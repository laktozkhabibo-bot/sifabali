import { redirect } from "next/navigation";
import { LoginForm } from "@/components/host/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HostLoginPage() {
  if (await isAuthenticated()) redirect("/hostpage");
  return <LoginForm />;
}
