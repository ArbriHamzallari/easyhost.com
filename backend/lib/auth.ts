import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "../../generated/prisma";
import { prisma } from "./prisma";

export { checkAdmin, type AdminCheck } from "./admin";

const TRIAL_DAYS = 7;

export type AuthedUser = {
  clerkUserId: string;
  userId: string;
  orgId: string;
};

export class UnauthenticatedError extends Error {
  constructor() {
    super("unauthenticated");
    this.name = "UnauthenticatedError";
  }
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "property";
}

async function uniqueOrgSlug(base: string): Promise<string> {
  const slug = slugify(base);
  const existing = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });
  return existing ? `${slug}-${Date.now().toString(36)}` : slug;
}

async function createUserAndOrg(clerkUserId: string): Promise<AuthedUser> {
  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";
  const name =
    clerkUser?.fullName ??
    clerkUser?.firstName ??
    email.split("@")[0] ??
    "Host";

  const orgSlug = await uniqueOrgSlug(name);
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  try {
    const org = await prisma.organization.create({
      data: {
        name,
        slug: orgSlug,
        trialEndsAt,
        users: { create: { clerkUserId, email, name, role: "owner" } },
      },
      select: { id: true, users: { select: { id: true }, take: 1 } },
    });
    return { clerkUserId, userId: org.users[0]!.id, orgId: org.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const fallback = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { id: true, orgId: true },
      });
      if (fallback) {
        return { clerkUserId, userId: fallback.id, orgId: fallback.orgId };
      }
    }
    throw err;
  }
}

/**
 * Returns the DB user + org, creating them on first login.
 * Idempotent and concurrency-safe.
 */
export async function requireUser(): Promise<AuthedUser> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new UnauthenticatedError();

  const existing = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true, orgId: true },
  });
  if (existing) {
    return { clerkUserId, userId: existing.id, orgId: existing.orgId };
  }

  return await createUserAndOrg(clerkUserId);
}

/**
 * Same as requireUser — auto-provisions on first login.
 * Use in server actions that may run before layout seeding.
 */
export async function getOrgUser(): Promise<{ orgId: string; userId: string }> {
  const u = await requireUser();
  return { orgId: u.orgId, userId: u.userId };
}
