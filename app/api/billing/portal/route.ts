import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/lib/prisma";
import { createCustomerPortalUrl, isPaddleConfigured } from "@/backend/lib/paddle";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!isPaddleConfigured()) {
    return NextResponse.redirect(`${appUrl}/settings/billing?error=paddle`);
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.redirect(`${appUrl}/sign-in`);
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      organization: {
        select: {
          paddleCustomerId: true,
          paddleSubscriptionId: true,
        },
      },
    },
  });

  const customerId = user?.organization.paddleCustomerId;
  if (!customerId) {
    return NextResponse.redirect(`${appUrl}/settings/billing?error=no_customer`);
  }

  const portalUrl = await createCustomerPortalUrl(
    customerId,
    user?.organization.paddleSubscriptionId
  );
  if (!portalUrl) {
    return NextResponse.redirect(`${appUrl}/settings/billing?error=portal`);
  }

  return NextResponse.redirect(portalUrl);
}
