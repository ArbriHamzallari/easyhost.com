import "server-only";

import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import type { SubscriptionTier } from "./subscription";

let paddleClient: Paddle | null = null;

export function isPaddleConfigured(): boolean {
  return !!(
    process.env.PADDLE_API_KEY &&
    process.env.PADDLE_WEBHOOK_SECRET &&
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  );
}

export function getPaddle(): Paddle {
  if (!paddleClient) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) throw new Error("PADDLE_API_KEY is not set");

    const envName = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
    paddleClient = new Paddle(apiKey, {
      environment:
        envName === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return paddleClient;
}

export function priceIdForTier(tier: SubscriptionTier): string {
  const id =
    tier === "pro"
      ? process.env.PADDLE_PRO_PRICE_ID
      : process.env.PADDLE_STARTER_PRICE_ID;
  if (!id) throw new Error(`Paddle price ID missing for tier: ${tier}`);
  return id;
}

export function tierFromPriceId(priceId: string): SubscriptionTier {
  if (priceId === process.env.PADDLE_PRO_PRICE_ID) return "pro";
  return "starter";
}

export function mapPaddleSubscriptionStatus(
  status: string
): "active" | "past_due" | "cancelled" | "trialing" {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "cancelled":
      return "cancelled";
    case "trialing":
      return "trialing";
    default:
      return "cancelled";
  }
}

export async function createCustomerPortalUrl(
  paddleCustomerId: string,
  paddleSubscriptionId?: string | null
): Promise<string | null> {
  try {
    const paddle = getPaddle();
    const subscriptionIds = paddleSubscriptionId ? [paddleSubscriptionId] : [];
    const session = await paddle.customerPortalSessions.create(
      paddleCustomerId,
      subscriptionIds
    );
    return session.urls.general.overview ?? null;
  } catch (err) {
    console.error("[paddle] createCustomerPortalUrl", err);
    return null;
  }
}
