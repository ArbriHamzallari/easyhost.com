import "server-only";
import { auth } from "@clerk/nextjs/server";

function allowlist(): string[] {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export type AdminCheck =
  | { state: "anon" }
  | { state: "denied"; userId: string }
  | { state: "allowed"; userId: string };

export async function checkAdmin(): Promise<AdminCheck> {
  const { userId } = await auth();
  if (!userId) return { state: "anon" };
  const allowed = allowlist();
  if (allowed.length === 0 || !allowed.includes(userId)) {
    return { state: "denied", userId };
  }
  return { state: "allowed", userId };
}
