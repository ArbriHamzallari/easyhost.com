import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/lib/prisma";
import {
  getStripeConnectAuthorizeUrl,
  isStripeConfigured,
} from "@/backend/lib/stripe";

export async function GET(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { orgId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: user.orgId },
    select: { id: true },
  });
  if (!property) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const url = getStripeConnectAuthorizeUrl(property.id);
  return NextResponse.redirect(url);
}
