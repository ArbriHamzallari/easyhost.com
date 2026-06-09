import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/lib/prisma";
import { generateQrPng, generateQrSvg } from "@/backend/lib/qr";
import { getOrgAccess } from "@/backend/lib/subscription";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { id: propertyId } = await params;
  const rawFormat = req.nextUrl.searchParams.get("format") ?? "png";

  if (rawFormat !== "png" && rawFormat !== "svg") {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }
  const format: "png" | "svg" = rawFormat;

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { orgId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const access = await getOrgAccess(user.orgId);
  if (!access.canGenerateQr) {
    return NextResponse.json(
      { error: "subscription_locked", message: "Activate a plan to generate QR codes." },
      { status: 403 }
    );
  }

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: user.orgId },
    select: {
      slug: true,
      accentColor: true,
      menus: {
        where: { isDraft: false },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!property) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (property.menus.length === 0) {
    return NextResponse.json(
      { error: "Menu must be published before generating a QR code." },
      { status: 403 }
    );
  }

  // Use the request's own origin so the QR encodes the correct URL in all environments
  // (localhost:3000 in dev, easyhost.pro in production).
  const baseUrl = req.nextUrl.origin;

  if (format === "svg") {
    const svg = await generateQrSvg(property.slug, baseUrl);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="qr-${property.slug}.svg"`,
      },
    });
  }

  const png = await generateQrPng(property.slug, baseUrl, property.accentColor ?? undefined);
  return new NextResponse(png as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${property.slug}.png"`,
    },
  });
}
