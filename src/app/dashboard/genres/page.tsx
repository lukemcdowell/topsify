import { getValidAccessToken } from "@/lib/auth";
import GenresClient from "./GenresClient";

export default async function GenresPage() {
  await getValidAccessToken("/dashboard/genres");
  return <GenresClient />;
}
