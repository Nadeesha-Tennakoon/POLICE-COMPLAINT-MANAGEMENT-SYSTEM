import { cookies } from "next/headers";
import { decypt } from "./sessions";

export default async function getAuthUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (session) {
    const user = await decypt(session);

    if (user) {
      return user;
    }
  }
}
