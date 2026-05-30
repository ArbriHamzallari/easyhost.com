import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { Prisma } from "../../generated/prisma";
import { prisma } from "./prisma";
import { getOrgAccess } from "./subscription";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type Result =
  | { ok: true }
  | { ok: false; error: ErrorCode };

export type ErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "invalid_input"
  | "invalid_iban"
  | "server_error";

const TRIAL_DAYS = 7;

// ─────────────────────────────────────────────────────────────────────────────
// Slugify (Unicode-aware)
// ─────────────────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "property";
}

// Tries the base slug; on collision appends a base36 timestamp for uniqueness.
async function uniqueOrgSlug(base: string): Promise<string> {
  const slug = slugify(base);
  const existing = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });
  return existing ? `${slug}-${Date.now().toString(36)}` : slug;
}

async function uniquePropertySlug(base: string): Promise<string> {
  const slug = slugify(base);
  const existing = await prisma.property.findUnique({
    where: { slug },
    select: { id: true },
  });
  return existing ? `${slug}-${Date.now().toString(36)}` : slug;
}

// ─────────────────────────────────────────────────────────────────────────────
// requireUser — single source of truth for authenticated user + org
// ─────────────────────────────────────────────────────────────────────────────
//
// Returns the DB user + their org, creating them on first login.
// Idempotent and concurrency-safe.

type AuthedUser = {
  clerkUserId: string;
  userId: string;
  orgId: string;
};

async function requireUser(): Promise<AuthedUser> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new UnauthenticatedError();

  // Fast path
  const existing = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true, orgId: true },
  });
  if (existing) {
    return { clerkUserId, userId: existing.id, orgId: existing.orgId };
  }

  // First-login path — atomic create with race protection
  return await createUserAndOrg(clerkUserId);
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
    // Concurrent first-login: another request just created the user record.
    // Fall back to fetching it.
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

class UnauthenticatedError extends Error {
  constructor() {
    super("unauthenticated");
    this.name = "UnauthenticatedError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: ensureOrgExists — used by layouts to seed the user record
// ─────────────────────────────────────────────────────────────────────────────

export async function ensureOrgExists(): Promise<{ orgId: string; userId: string }> {
  const u = await requireUser();
  return { orgId: u.orgId, userId: u.userId };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: getOnboardingState — single query, returns property for wizard use
// ─────────────────────────────────────────────────────────────────────────────

export async function getOnboardingState(): Promise<{
  hasOrg: boolean;
  hasProperty: boolean;
  propertyId: string | null;
  intentSet: boolean;
  onboardingComplete: boolean;
}> {
  let user: AuthedUser;
  try {
    user = await requireUser();
  } catch {
    return {
      hasOrg: false,
      hasProperty: false,
      propertyId: null,
      intentSet: false,
      onboardingComplete: false,
    };
  }

  const [org, property] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: user.orgId },
      select: { intentType: true },
    }),
    prisma.property.findFirst({
      where: { orgId: user.orgId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
  ]);

  return {
    hasOrg: true,
    hasProperty: !!property,
    propertyId: property?.id ?? null,
    intentSet: !!org?.intentType,
    onboardingComplete: !!property,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: getActiveOnboardingProperty
//
// Returns the property the host is currently onboarding. In Phase 2, hosts have
// only one property — so we simply return their most recent property.
// Replaces the fragile cookie-based propertyId approach.

export async function getActiveOnboardingProperty(): Promise<string | null> {
  let user: AuthedUser;
  try {
    user = await requireUser();
  } catch {
    return null;
  }

  const property = await prisma.property.findFirst({
    where: { orgId: user.orgId },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  return property?.id ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: saveOrgIntent
// ─────────────────────────────────────────────────────────────────────────────

const IntentSchema = z.object({
  intentType: z.enum(["airbnb_host", "hotel_owner", "vacation_rental_manager", "other"]),
});

export async function saveOrgIntent(input: { intentType: string }): Promise<Result> {
  "use server";
  const parsed = IntentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await requireUser();
    await prisma.organization.update({
      where: { id: user.orgId },
      data: { intentType: parsed.data.intentType },
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof UnauthenticatedError) return { ok: false, error: "unauthenticated" };
    logError("saveOrgIntent", err);
    return { ok: false, error: "server_error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: createProperty
// ─────────────────────────────────────────────────────────────────────────────

const CreatePropertySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  type: z.enum(["apartment", "villa", "cottage", "suite", "hotel", "hostel", "beachfront", "other"]),
});

export async function createProperty(input: {
  name: string;
  type: string;
}): Promise<{ ok: true; propertyId: string } | { ok: false; error: ErrorCode }> {
  "use server";
  const parsed = CreatePropertySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await requireUser();
    const access = await getOrgAccess(user.orgId);
    if (!access.canAddProperty) {
      return { ok: false, error: "forbidden" };
    }

    const slug = await uniquePropertySlug(parsed.data.name);

    const property = await prisma.property.create({
      data: {
        orgId: user.orgId,
        name: parsed.data.name,
        slug,
        type: parsed.data.type,
      },
      select: { id: true },
    });
    return { ok: true, propertyId: property.id };
  } catch (err) {
    if (err instanceof UnauthenticatedError) return { ok: false, error: "unauthenticated" };
    logError("createProperty", err);
    return { ok: false, error: "server_error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: updatePropertyLocation
// ─────────────────────────────────────────────────────────────────────────────

// Validate against the runtime's IANA timezone database — no static list to maintain.
function isIanaTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// ISO 4217 currencies accepted at launch. Expand as needed.
const ACCEPTED_CURRENCIES = [
  "EUR", "USD", "GBP", "ALL", "CHF", "CAD", "AUD", "JPY",
  "SEK", "NOK", "DKK", "HRK", "MKD", "BAM", "RSD",
] as const;

const LocationSchema = z.object({
  propertyId: z.string().min(1),
  address: z.string().min(1).max(500).trim(),
  timezone: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .refine(isIanaTimezone, "invalid_timezone"),
  currency: z.enum(ACCEPTED_CURRENCIES),
});

export async function updatePropertyLocation(input: {
  propertyId: string;
  address: string;
  timezone: string;
  currency: string;
}): Promise<Result> {
  "use server";
  const parsed = LocationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await requireUser();
    const updated = await prisma.property.updateMany({
      where: { id: parsed.data.propertyId, orgId: user.orgId },
      data: {
        address: parsed.data.address,
        timezone: parsed.data.timezone,
        currency: parsed.data.currency,
      },
    });
    if (updated.count === 0) return { ok: false, error: "forbidden" };
    return { ok: true };
  } catch (err) {
    if (err instanceof UnauthenticatedError) return { ok: false, error: "unauthenticated" };
    logError("updatePropertyLocation", err);
    return { ok: false, error: "server_error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: updatePropertyBranding
// ─────────────────────────────────────────────────────────────────────────────

const BrandingSchema = z.object({
  propertyId: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
});

export async function updatePropertyBranding(input: {
  propertyId: string;
  logoUrl?: string;
  accentColor?: string;
  heroImageUrl?: string;
}): Promise<Result> {
  "use server";
  const parsed = BrandingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  try {
    const user = await requireUser();
    const updated = await prisma.property.updateMany({
      where: { id: parsed.data.propertyId, orgId: user.orgId },
      data: {
        logoUrl: parsed.data.logoUrl || null,
        accentColor: parsed.data.accentColor || null,
        heroImageUrl: parsed.data.heroImageUrl || null,
      },
    });
    if (updated.count === 0) return { ok: false, error: "forbidden" };
    return { ok: true };
  } catch (err) {
    if (err instanceof UnauthenticatedError) return { ok: false, error: "unauthenticated" };
    logError("updatePropertyBranding", err);
    return { ok: false, error: "server_error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: updatePropertyPayment
// ─────────────────────────────────────────────────────────────────────────────

const PaymentSchema = z.object({
  propertyId: z.string().min(1),
  iban: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "invalid_iban")
    .optional()
    .or(z.literal("")),
  acceptCash: z.boolean(),
});

export async function updatePropertyPayment(input: {
  propertyId: string;
  iban?: string;
  acceptCash: boolean;
}): Promise<Result> {
  "use server";
  const parsed = PaymentSchema.safeParse(input);
  if (!parsed.success) {
    const ibanIssue = parsed.error.issues.find((i) => i.path.includes("iban"));
    return { ok: false, error: ibanIssue ? "invalid_iban" : "invalid_input" };
  }

  try {
    const user = await requireUser();
    const updated = await prisma.property.updateMany({
      where: { id: parsed.data.propertyId, orgId: user.orgId },
      data: {
        iban: parsed.data.iban || null,
        acceptCash: parsed.data.acceptCash,
      },
    });
    if (updated.count === 0) return { ok: false, error: "forbidden" };
    return { ok: true };
  } catch (err) {
    if (err instanceof UnauthenticatedError) return { ok: false, error: "unauthenticated" };
    logError("updatePropertyPayment", err);
    return { ok: false, error: "server_error" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public: getPropertyOnboardingChecklist
//
// Authorization-checked. Returns null if the property doesn't belong to the
// caller, instead of leaking another property's state.

export async function getPropertyOnboardingChecklist(propertyId: string): Promise<{
  hasBranding: boolean;
  hasPayment: boolean;
  hasMenu: boolean;
  hasQr: boolean;
} | null> {
  let user: AuthedUser;
  try {
    user = await requireUser();
  } catch {
    return null;
  }

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: user.orgId },
    select: {
      id: true,
      logoUrl: true,
      accentColor: true,
      iban: true,
      acceptCash: true,
      stripeAccountId: true,
    },
  });
  if (!property) return null;

  const menu = await prisma.menu.findFirst({
    where: { propertyId: property.id },
    select: {
      isDraft: true,
      _count: { select: { items: true } },
    },
  });

  const hasBranding = !!(property.logoUrl || property.accentColor);
  const hasPayment = !!(property.iban || property.acceptCash || property.stripeAccountId);
  const hasMenu = !!(menu && menu._count.items > 0);
  const hasQr = !!(menu && !menu.isDraft);

  return { hasBranding, hasPayment, hasMenu, hasQr };
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal: structured error logging
// ─────────────────────────────────────────────────────────────────────────────

function logError(scope: string, err: unknown): void {
  if (err instanceof Error) {
    console.error(`[org] ${scope}: ${err.name}: ${err.message}`);
    if (err.stack) console.error(err.stack);
  } else {
    console.error(`[org] ${scope}:`, err);
  }
}
