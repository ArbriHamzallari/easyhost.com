import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  try {
    const evt = await verifyWebhook(req, { signingSecret: secret });

    switch (evt.type) {
      case "user.deleted": {
        const clerkUserId = evt.data.id;
        if (clerkUserId) {
          await prisma.user.deleteMany({ where: { clerkUserId } });
        }
        break;
      }
      case "user.updated": {
        const clerkUserId = evt.data.id;
        if (!clerkUserId) break;

        const email =
          evt.data.email_addresses?.find(
            (e) => e.id === evt.data.primary_email_address_id
          )?.email_address ??
          evt.data.email_addresses?.[0]?.email_address;
        const name =
          [evt.data.first_name, evt.data.last_name].filter(Boolean).join(" ") ||
          null;

        await prisma.user.updateMany({
          where: { clerkUserId },
          data: {
            ...(email ? { email } : {}),
            ...(name ? { name } : {}),
          },
        });
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[clerk/webhook]", err);
    return NextResponse.json({ error: "invalid_webhook" }, { status: 401 });
  }
}
