import { NextResponse } from "next/server";
import { getPaddle, isPaddleConfigured } from "@/backend/lib/paddle";
import { handlePaddleWebhookEvent } from "@/backend/lib/paddle-webhooks";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isPaddleConfigured()) {
    return NextResponse.json(
      { error: "paddle_not_configured" },
      { status: 503 }
    );
  }

  const signature = req.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const secret = process.env.PADDLE_WEBHOOK_SECRET!;

  try {
    const event = await getPaddle().webhooks.unmarshal(
      rawBody,
      secret,
      signature
    );

    await handlePaddleWebhookEvent(event.eventType, event.data);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[paddle/webhook]", err);
    return NextResponse.json({ error: "invalid_webhook" }, { status: 400 });
  }
}
