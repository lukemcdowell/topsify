import { getValidAccessToken } from "@/lib/auth";
import ArtistsClient from "./ArtistsClient";

export default async function ArtistsPage() {
  await getValidAccessToken();
  return <ArtistsClient />;
}
