import "server-only";

import { z } from "zod";
import { Prisma } from "../../generated/prisma";
import { prisma } from "./prisma";
import { ensureOrgExists } from "./org";
import { getOrCreateGuestSessionId } from "./guest-session";
import { sendOrderReceiptEmail } from "./emails/order-receipt";
import {
  createGuestPaymentIntent,
  isStripeConfigured,
} from "./stripe";
import { getOrgAccessForPropertySlug } from "./subscription";

export type OrderErrorCode =
  | "not_found"
  | "invalid_input"
  | "payment_unavailable"
  | "out_of_stock"
  | "menu_unavailable"
  | "forbidden"
  | "invalid_state"
  | "server_error";

export type OrderResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: OrderErrorCode };

export type GuestPaymentMethod = "cash" | "bank_transfer" | "stripe";

const LOCALES = ["en", "al", "it", "de"] as const;

const CartLineSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const CreateGuestOrderSchema = z.object({
  items: z.array(CartLineSchema).min(1).max(50),
  guestName: z.string().min(1).max(120).trim(),
  guestEmail: z.string().email().max(254),
  paymentMethod: z.enum(["cash", "bank_transfer", "stripe"]),
  language: z.enum(LOCALES),
});

export type GuestCheckoutOptions = {
  propertyId: string;
  propertyName: string;
  currency: string;
  accentColor: string | null;
  methods: GuestPaymentMethod[];
  iban: string | null;
  stripePublishableKey: string | null;
};

type LineRow = {
  menuItemId: string;
  itemNameSnapshot: Prisma.InputJsonValue;
  quantity: number;
  unitPrice: Prisma.Decimal;
};

type ValidatedCart = {
  property: {
    id: string;
    name: string;
    currency: string;
    iban: string | null;
    acceptCash: boolean;
    stripeAccountId: string | null;
    stripeOnboardingComplete: boolean;
  };
  menuId: string;
  total: Prisma.Decimal;
  lineRows: LineRow[];
  items: { menuItemId: string; quantity: number }[];
};

async function validateCart(
  slug: string,
  items: { menuItemId: string; quantity: number }[]
): Promise<OrderResult<ValidatedCart>> {
  const property = await prisma.property.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      currency: true,
      iban: true,
      acceptCash: true,
      stripeAccountId: true,
      stripeOnboardingComplete: true,
      menus: {
        where: { isDraft: false, isActive: true },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!property || property.menus.length === 0) {
    return { ok: false, error: "not_found" };
  }

  const menuId = property.menus[0]!.id;
  const menuItemIds = [...new Set(items.map((i) => i.menuItemId))];

  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: menuItemIds },
      menuId,
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      stockQuantity: true,
    },
  });

  if (menuItems.length !== menuItemIds.length) {
    return { ok: false, error: "invalid_input" };
  }

  const itemMap = new Map(menuItems.map((m) => [m.id, m]));
  let total = new Prisma.Decimal(0);
  const lineRows: LineRow[] = [];

  for (const line of items) {
    const item = itemMap.get(line.menuItemId);
    if (!item) return { ok: false, error: "invalid_input" };
    if (item.stockQuantity < line.quantity) {
      return { ok: false, error: "out_of_stock" };
    }
    total = total.add(item.price.mul(line.quantity));
    lineRows.push({
      menuItemId: item.id,
      itemNameSnapshot: item.name as Prisma.InputJsonValue,
      quantity: line.quantity,
      unitPrice: item.price,
    });
  }

  return {
    ok: true,
    data: {
      property,
      menuId,
      total,
      lineRows,
      items,
    },
  };
}

export async function getGuestCheckoutOptions(
  slug: string
): Promise<OrderResult<GuestCheckoutOptions>> {
  const property = await prisma.property.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      currency: true,
      accentColor: true,
      iban: true,
      acceptCash: true,
      stripeAccountId: true,
      stripeOnboardingComplete: true,
      menus: {
        where: { isDraft: false, isActive: true },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!property || property.menus.length === 0) {
    return { ok: false, error: "not_found" };
  }

  const methods: GuestPaymentMethod[] = [];
  if (
    property.stripeAccountId &&
    property.stripeOnboardingComplete &&
    isStripeConfigured()
  ) {
    methods.push("stripe");
  }
  if (property.iban) methods.push("bank_transfer");
  if (property.acceptCash) methods.push("cash");

  if (methods.length === 0) {
    return { ok: false, error: "payment_unavailable" };
  }

  return {
    ok: true,
    data: {
      propertyId: property.id,
      propertyName: property.name,
      currency: property.currency,
      accentColor: property.accentColor,
      methods,
      iban: property.iban,
      stripePublishableKey: isStripeConfigured()
        ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        : null,
    },
  };
}

function statusForPayment(method: GuestPaymentMethod): string {
  if (method === "cash") return "cash_pending";
  if (method === "bank_transfer") return "bank_transfer_pending";
  return "pending";
}

async function decrementStock(
  tx: Prisma.TransactionClient,
  menuId: string,
  items: { menuItemId: string; quantity: number }[]
) {
  for (const line of items) {
    const updated = await tx.menuItem.updateMany({
      where: {
        id: line.menuItemId,
        menuId,
        stockQuantity: { gte: line.quantity },
      },
      data: { stockQuantity: { decrement: line.quantity } },
    });
    if (updated.count === 0) throw new Error("out_of_stock");
  }
}

export async function restoreOrderStock(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      items: { select: { menuItemId: true, quantity: true } },
      property: { select: { menus: { take: 1, select: { id: true } } } },
    },
  });
  if (!order?.property.menus[0]) return;

  const menuId = order.property.menus[0].id;
  await prisma.$transaction(async (tx) => {
    for (const line of order.items) {
      await tx.menuItem.update({
        where: { id: line.menuItemId, menuId },
        data: { stockQuantity: { increment: line.quantity } },
      });
    }
  });
}

export async function fulfillStripeOrder(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      guestEmail: true,
      guestName: true,
      totalAmount: true,
      currency: true,
      language: true,
      property: { select: { name: true } },
    },
  });

  if (!order || order.status === "paid") return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntentId,
      receiptSentAt: new Date(),
    },
  });

  if (order.guestEmail && order.guestName) {
    void sendOrderReceiptEmail({
      to: order.guestEmail,
      guestName: order.guestName,
      propertyName: order.property.name,
      orderId: order.id,
      totalAmount: order.totalAmount.toString(),
      currency: order.currency,
      paymentMethod: "stripe",
      language: order.language,
      iban: null,
    }).catch((err) => console.error("[orders] stripe receipt failed", err));
  }
}

export async function cancelStripeOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, paymentMethod: true },
  });

  if (!order || order.status === "paid" || order.status === "cancelled") {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "cancelled" },
  });

  await restoreOrderStock(orderId);
}

export type CreateGuestOrderResponse =
  | {
      orderId: string;
      status: string;
      totalAmount: string;
      currency: string;
      paymentMethod: GuestPaymentMethod;
      iban: string | null;
    }
  | {
      orderId: string;
      status: string;
      totalAmount: string;
      currency: string;
      paymentMethod: "stripe";
      clientSecret: string;
    };

export async function createGuestOrder(
  slug: string,
  raw: unknown
): Promise<OrderResult<CreateGuestOrderResponse>> {
  const parsed = CreateGuestOrderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  const { items, guestName, guestEmail, paymentMethod, language } = parsed.data;

  const access = await getOrgAccessForPropertySlug(slug);
  if (!access?.canAcceptOrders) {
    return { ok: false, error: "payment_unavailable" };
  }

  const validated = await validateCart(slug, items);
  if (!validated.ok) return validated;

  const { property, menuId, total, lineRows } = validated.data;

  if (paymentMethod === "bank_transfer" && !property.iban) {
    return { ok: false, error: "payment_unavailable" };
  }
  if (paymentMethod === "cash" && !property.acceptCash) {
    return { ok: false, error: "payment_unavailable" };
  }
  if (
    paymentMethod === "stripe" &&
    (!property.stripeAccountId ||
      !property.stripeOnboardingComplete ||
      !isStripeConfigured())
  ) {
    return { ok: false, error: "payment_unavailable" };
  }

  const guestSessionId = await getOrCreateGuestSessionId();
  const status = statusForPayment(paymentMethod);

  try {
    if (paymentMethod === "stripe") {
      const order = await prisma.$transaction(async (tx) => {
        await decrementStock(tx, menuId, items);
        return tx.order.create({
          data: {
            propertyId: property.id,
            guestSessionId,
            guestName,
            guestEmail,
            status,
            paymentMethod,
            totalAmount: total,
            currency: property.currency,
            language,
            items: { create: lineRows },
          },
          select: {
            id: true,
            status: true,
            totalAmount: true,
            currency: true,
          },
        });
      });

      const amountCents = Math.round(Number(order.totalAmount) * 100);
      const pi = await createGuestPaymentIntent({
        amountCents,
        currency: property.currency,
        connectedAccountId: property.stripeAccountId!,
        orderId: order.id,
        guestEmail,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: pi.id },
      });

      if (!pi.client_secret) {
        await cancelStripeOrder(order.id);
        return { ok: false, error: "server_error" };
      }

      return {
        ok: true,
        data: {
          orderId: order.id,
          status: order.status,
          totalAmount: order.totalAmount.toString(),
          currency: order.currency,
          paymentMethod: "stripe",
          clientSecret: pi.client_secret,
        },
      };
    }

    const order = await prisma.$transaction(async (tx) => {
      await decrementStock(tx, menuId, items);
      return tx.order.create({
        data: {
          propertyId: property.id,
          guestSessionId,
          guestName,
          guestEmail,
          status,
          paymentMethod,
          totalAmount: total,
          currency: property.currency,
          language,
          items: { create: lineRows },
        },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          currency: true,
          paymentMethod: true,
        },
      });
    });

    const payment = order.paymentMethod as "cash" | "bank_transfer";

    void sendOrderReceiptEmail({
      to: guestEmail,
      guestName,
      propertyName: property.name,
      orderId: order.id,
      totalAmount: order.totalAmount.toString(),
      currency: order.currency,
      paymentMethod: payment,
      language,
      iban: payment === "bank_transfer" ? property.iban : null,
    }).catch((err) => console.error("[orders] receipt email failed", err));

    return {
      ok: true,
      data: {
        orderId: order.id,
        status: order.status,
        totalAmount: order.totalAmount.toString(),
        currency: order.currency,
        paymentMethod: payment,
        iban: payment === "bank_transfer" ? property.iban : null,
      },
    };
  } catch (err) {
    if (err instanceof Error && err.message === "out_of_stock") {
      return { ok: false, error: "out_of_stock" };
    }
    console.error("[orders] createGuestOrder", err);
    return { ok: false, error: "server_error" };
  }
}

export async function markOrderAsPaid(orderId: string): Promise<OrderResult> {
  const { orgId } = await ensureOrgExists();

  const order = await prisma.order.findFirst({
    where: { id: orderId, property: { orgId } },
    select: { id: true, status: true },
  });

  if (!order) return { ok: false, error: "not_found" };
  if (order.status === "paid") return { ok: true, data: undefined };

  if (
    order.status !== "cash_pending" &&
    order.status !== "bank_transfer_pending"
  ) {
    return { ok: false, error: "invalid_state" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid", paidAt: new Date() },
  });

  return { ok: true, data: undefined };
}

export async function getGuestOrderForSuccess(
  slug: string,
  orderId: string
): Promise<
  OrderResult<{
    orderId: string;
    status: string;
    totalAmount: string;
    currency: string;
    paymentMethod: string;
    guestName: string | null;
    iban: string | null;
    propertyName: string;
    accentColor: string | null;
  }>
> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, property: { slug, isActive: true } },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      currency: true,
      paymentMethod: true,
      guestName: true,
      property: {
        select: { name: true, accentColor: true, iban: true },
      },
    },
  });

  if (!order) return { ok: false, error: "not_found" };

  return {
    ok: true,
    data: {
      orderId: order.id,
      status: order.status,
      totalAmount: order.totalAmount.toString(),
      currency: order.currency,
      paymentMethod: order.paymentMethod ?? "",
      guestName: order.guestName,
      iban:
        order.paymentMethod === "bank_transfer" ? order.property.iban : null,
      propertyName: order.property.name,
      accentColor: order.property.accentColor,
    },
  };
}
