import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    stripeClient = new Stripe(key, { typescript: true });
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_CONNECT_CLIENT_ID
  );
}

export function getStripeConnectAuthorizeUrl(propertyId: string): string {
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !appUrl) {
    throw new Error("Stripe Connect is not configured");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "read_write",
    redirect_uri: `${appUrl}/api/stripe/connect/callback`,
    state: propertyId,
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeConnectCode(code: string): Promise<{
  accountId: string;
  chargesEnabled: boolean;
}> {
  const stripe = getStripe();
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code,
  });

  const accountId = response.stripe_user_id;
  if (!accountId) throw new Error("No Stripe account id in OAuth response");

  const account = await stripe.accounts.retrieve(accountId);
  return {
    accountId,
    chargesEnabled: account.charges_enabled ?? false,
  };
}

export async function createGuestPaymentIntent(input: {
  amountCents: number;
  currency: string;
  connectedAccountId: string;
  orderId: string;
  guestEmail: string;
}): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return stripe.paymentIntents.create(
    {
      amount: input.amountCents,
      currency: input.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: input.orderId },
      receipt_email: input.guestEmail,
    },
    { stripeAccount: input.connectedAccountId }
  );
}
