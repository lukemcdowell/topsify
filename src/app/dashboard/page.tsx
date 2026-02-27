import { getValidAccessToken } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  await getValidAccessToken();
  return <DashboardClient />;
}
