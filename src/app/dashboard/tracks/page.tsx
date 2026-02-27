import { getValidAccessToken } from "@/lib/auth";
import TracksClient from "./TracksClient";

export default async function TracksPage() {
  await getValidAccessToken();
  return <TracksClient />;
}
