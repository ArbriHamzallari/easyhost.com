import "server-only";

import { cookies } from "next/headers";

export const GUEST_SESSION_COOKIE = "easyhost_guest_session";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getGuestSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(GUEST_SESSION_COOKIE)?.value;
}

export async function getOrCreateGuestSessionId(): Promise<string> {
  const existing = await getGuestSessionId();
  if (existing) return existing;

  const id = crypto.randomUUID();
  const store = await cookies();
  store.set(GUEST_SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return id;
}
