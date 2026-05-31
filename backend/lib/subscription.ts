import "server-only";

import { prisma } from "./prisma";
import { daysUntil } from "./dates";

export type SubscriptionTier = "starter" | "pro";

export type OrgAccess = {
  subscriptionStatus: string;
  subscriptionTier: SubscriptionTier;
  trialEndsAt: Date | null;
  daysLeftInTrial: number;
  maxProperties: number;
  propertyCount: number;
  /** Paid or in active trial — guest orders, QR, publish allowed */
  canUseProduct: boolean;
  canAcceptOrders: boolean;
  canGenerateQr: boolean;
  canPublishMenu: boolean;
  canAddProperty: boolean;
  needsUpgrade: boolean;
};

export function computeOrgAccess(input: {
  subscriptionStatus: string;
  subscriptionTier: string;
  trialEndsAt: Date | null;
  propertyCount: number;
}): OrgAccess {
  const tier: SubscriptionTier =
    input.subscriptionTier === "pro" ? "pro" : "starter";
  const maxProperties = tier === "pro" ? 5 : 1;
  const daysLeftInTrial = daysUntil(input.trialEndsAt);
  const trialActive = daysLeftInTrial > 0;
  const paidActive = input.subscriptionStatus === "active";
  const canUseProduct = paidActive || trialActive;

  return {
    subscriptionStatus: input.subscriptionStatus,
    subscriptionTier: tier,
    trialEndsAt: input.trialEndsAt,
    daysLeftInTrial,
    maxProperties,
    propertyCount: input.propertyCount,
    canUseProduct,
    canAcceptOrders: canUseProduct,
    canGenerateQr: canUseProduct,
    canPublishMenu: canUseProduct,
    canAddProperty: canUseProduct && input.propertyCount < maxProperties,
    needsUpgrade: !canUseProduct,
  };
}

export async function getOrgAccess(orgId: string): Promise<OrgAccess> {
  const [org, propertyCount] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        subscriptionStatus: true,
        subscriptionTier: true,
        trialEndsAt: true,
      },
    }),
    prisma.property.count({ where: { orgId, isActive: true } }),
  ]);

  if (!org) {
    return computeOrgAccess({
      subscriptionStatus: "cancelled",
      subscriptionTier: "starter",
      trialEndsAt: null,
      propertyCount: 0,
    });
  }

  return computeOrgAccess({
    subscriptionStatus: org.subscriptionStatus,
    subscriptionTier: org.subscriptionTier,
    trialEndsAt: org.trialEndsAt,
    propertyCount,
  });
}

export async function getOrgAccessForProperty(
  propertyId: string
): Promise<OrgAccess | null> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { orgId: true },
  });
  if (!property) return null;
  return getOrgAccess(property.orgId);
}

export async function getOrgAccessForPropertySlug(
  slug: string
): Promise<OrgAccess | null> {
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { orgId: true },
  });
  if (!property) return null;
  return getOrgAccess(property.orgId);
}

export class SubscriptionLockedError extends Error {
  constructor() {
    super("subscription_locked");
    this.name = "SubscriptionLockedError";
  }
}

export async function assertOrgCanAcceptOrders(orgId: string): Promise<void> {
  const access = await getOrgAccess(orgId);
  if (!access.canAcceptOrders) throw new SubscriptionLockedError();
}

export async function assertOrgCanUseProduct(orgId: string): Promise<void> {
  const access = await getOrgAccess(orgId);
  if (!access.canUseProduct) throw new SubscriptionLockedError();
}
