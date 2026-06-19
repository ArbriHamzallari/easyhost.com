import "server-only";

import { prisma } from "./prisma";
import { requireUser } from "./auth";

export type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type TopItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type PropertyAnalytics = {
  currency: string;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  dailySeries: RevenuePoint[];
  topItems: TopItem[];
  recentOrders: {
    id: string;
    guestName: string | null;
    status: string;
    paymentMethod: string | null;
    totalAmount: number;
    currency: string;
    createdAt: Date;
  }[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getPropertyAnalytics(
  propertyId: string
): Promise<PropertyAnalytics | null> {
  const user = await requireUser();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, orgId: user.orgId },
    select: { id: true, currency: true },
  });
  if (!property) return null;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 29);

  const paidStatuses = ["paid"];

  const [todayAgg, weekAgg, monthAgg, orders, orderItems] = await Promise.all([
    prisma.order.aggregate({
      where: {
        propertyId,
        status: { in: paidStatuses },
        paidAt: { gte: todayStart },
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: {
        propertyId,
        status: { in: paidStatuses },
        paidAt: { gte: weekStart },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: {
        propertyId,
        status: { in: paidStatuses },
        paidAt: { gte: monthStart },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: {
        propertyId,
        status: { in: paidStatuses },
        paidAt: { gte: monthStart },
      },
      select: {
        id: true,
        guestName: true,
        status: true,
        paymentMethod: true,
        totalAmount: true,
        currency: true,
        paidAt: true,
        createdAt: true,
      },
      orderBy: { paidAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: {
        order: {
          propertyId,
          status: { in: paidStatuses },
          paidAt: { gte: monthStart },
        },
      },
      select: {
        menuItemId: true,
        quantity: true,
        unitPrice: true,
        itemNameSnapshot: true,
      },
    }),
  ]);

  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(monthStart);
    d.setDate(d.getDate() + i);
    dailyMap.set(d.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const key = (order.paidAt ?? order.createdAt).toISOString().slice(0, 10);
    const bucket = dailyMap.get(key);
    if (!bucket) continue;
    bucket.revenue += Number(order.totalAmount);
    bucket.orders += 1;
  }

  const dailySeries: RevenuePoint[] = [...dailyMap.entries()].map(
    ([date, v]) => ({
      date,
      revenue: Math.round(v.revenue * 100) / 100,
      orders: v.orders,
    })
  );

  const itemTotals = new Map<
    string,
    { name: string; quantity: number; revenue: number }
  >();
  for (const row of orderItems) {
    const snap = row.itemNameSnapshot as Record<string, string> | null;
    const name = snap?.en ?? snap?.al ?? "Item";
    const existing = itemTotals.get(row.menuItemId) ?? {
      name,
      quantity: 0,
      revenue: 0,
    };
    existing.quantity += row.quantity;
    existing.revenue += Number(row.unitPrice) * row.quantity;
    itemTotals.set(row.menuItemId, existing);
  }

  const topItems = [...itemTotals.entries()]
    .map(([menuItemId, v]) => ({
      menuItemId,
      name: v.name,
      quantity: v.quantity,
      revenue: Math.round(v.revenue * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    currency: property.currency,
    todayRevenue: Number(todayAgg._sum.totalAmount ?? 0),
    weekRevenue: Number(weekAgg._sum.totalAmount ?? 0),
    monthRevenue: Number(monthAgg._sum.totalAmount ?? 0),
    dailySeries,
    topItems,
    recentOrders: orders.slice(0, 20).map((o) => ({
      id: o.id,
      guestName: o.guestName,
      status: o.status,
      paymentMethod: o.paymentMethod,
      totalAmount: Number(o.totalAmount),
      currency: o.currency,
      createdAt: o.paidAt ?? o.createdAt,
    })),
  };
}
