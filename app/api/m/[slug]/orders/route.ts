import { NextRequest, NextResponse } from "next/server";
import { createGuestOrder } from "@/backend/lib/orders";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const result = await createGuestOrder(slug, body);

  if (!result.ok) {
    const status =
      result.error === "not_found"
        ? 404
        : result.error === "out_of_stock"
          ? 409
          : result.error === "payment_unavailable"
            ? 503
            : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data, { status: 201 });
}
