import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAMES } from "./cookies";

export async function getValidAccessToken(
  currentPath = "/dashboard",
): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (accessToken) {
    return accessToken;
  }

  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    redirect("/");
  }

  redirect(`/api/refresh?redirect=${currentPath}`);
}
