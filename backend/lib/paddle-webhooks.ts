import "server-only";

import type { Subscription } from "@paddle/paddle-node-sdk";
import { prisma } from "./prisma";
import {
  getPaddle,
  mapPaddleSubscriptionStatus,
  tierFromPriceId,
} from "./paddle";

function subscriptionPriceId(sub: Subscription): string | undefined {
  const item = sub.items?.[0];
  return item?.price?.id;
}

export async function syncSubscriptionFromPaddle(
  subscription: Subscription
): Promise<void> {
  const customData = subscription.customData as
    | Record<string, unknown>
    | undefined;
  const orgId =
    typeof customData?.orgId === "string" ? customData.orgId : undefined;

  let org = orgId
    ? await prisma.organization.findUnique({
        where: { id: orgId },
        select: { id: true },
      })
    : null;

  if (!org && subscription.customerId) {
    org = await prisma.organization.findFirst({
      where: { paddleCustomerId: subscription.customerId },
      select: { id: true },
    });
  }

  if (!org && subscription.id) {
    org = await prisma.organization.findFirst({
      where: { paddleSubscriptionId: subscription.id },
      select: { id: true },
    });
  }

  if (!org) {
    console.warn(
      "[paddle/webhook] Could not resolve org for subscription",
      subscription.id
    );
    return;
  }

  const priceId = subscriptionPriceId(subscription);
  const tier = priceId ? tierFromPriceId(priceId) : "starter";
  const status = mapPaddleSubscriptionStatus(subscription.status);

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      paddleCustomerId: subscription.customerId ?? undefined,
      paddleSubscriptionId: subscription.id,
      subscriptionStatus: status,
      subscriptionTier: tier,
    },
  });
}

export async function handlePaddleWebhookEvent(
  eventType: string,
  data: unknown
): Promise<void> {
  if (
    eventType === "subscription.activated" ||
    eventType === "subscription.created" ||
    eventType === "subscription.updated" ||
    eventType === "subscription.resumed"
  ) {
    await syncSubscriptionFromPaddle(data as Subscription);
    return;
  }

  if (
    eventType === "subscription.canceled" ||
    eventType === "subscription.cancelled" ||
    eventType === "subscription.past_due"
  ) {
    await syncSubscriptionFromPaddle(data as Subscription);
    return;
  }

  if (eventType === "subscription.payment_failed") {
    const sub = data as Subscription;
    const org = sub.id
      ? await prisma.organization.findFirst({
          where: { paddleSubscriptionId: sub.id },
          select: { id: true },
        })
      : null;
    if (org) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { subscriptionStatus: "past_due" },
      });
    }
    return;
  }

  if (eventType === "transaction.completed") {
    const tx = data as { subscriptionId?: string };
    if (tx.subscriptionId) {
      try {
        const sub = await getPaddle().subscriptions.get(tx.subscriptionId);
        await syncSubscriptionFromPaddle(sub);
      } catch (err) {
        console.error("[paddle/webhook] transaction.completed", err);
      }
    }
  }
}
