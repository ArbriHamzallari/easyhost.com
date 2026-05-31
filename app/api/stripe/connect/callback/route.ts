import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/lib/prisma";
import { exchangeConnectCode, isStripeConfigured } from "@/backend/lib/stripe";

export async function GET(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectBase = `${appUrl}/onboarding/payment`;

  if (!isStripeConfigured()) {
    return NextResponse.redirect(`${redirectBase}?stripe=error`);
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.redirect(`${appUrl}/sign-in`);
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${redirectBase}?stripe=error`);
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { orgId: true },
  });
  if (!user) {
    return NextResponse.redirect(`${appUrl}/sign-in`);
  }

  const property = await prisma.property.findFirst({
    where: { id: state, orgId: user.orgId },
    select: { id: true },
  });
  if (!property) {
    return NextResponse.redirect(`${redirectBase}?stripe=error`);
  }

  try {
    const { accountId, chargesEnabled } = await exchangeConnectCode(code);
    await prisma.property.update({
      where: { id: property.id },
      data: {
        stripeAccountId: accountId,
        stripeOnboardingComplete: chargesEnabled,
      },
    });
    return NextResponse.redirect(`${redirectBase}?stripe=connected`);
  } catch (err) {
    console.error("[stripe/connect/callback]", err);
    return NextResponse.redirect(`${redirectBase}?stripe=error`);
  }
}
