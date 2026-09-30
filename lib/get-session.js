import { cookies } from "next/headers";
import { verifySession } from "./session";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  return await verifySession(token);
}
