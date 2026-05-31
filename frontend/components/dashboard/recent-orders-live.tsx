"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { MarkOrderPaidButton } from "@/frontend/components/dashboard/mark-order-paid-button";
import {
  getSupabaseBrowser,
  isSupabaseRealtimeConfigured,
} from "@/frontend/lib/supabase-browser";

export type DashboardOrderRow = {
  id: string;
  status: string;
  totalAmount: string;
  currency: string;
  createdAt: string;
  guestName: string | null;
  paymentMethod: string | null;
  items: { itemNameSnapshot: unknown; quantity: number }[];
};

const STATUS_CONFIG: Record<string, { dot: string; label: string }> = {
  paid: { dot: "var(--success)", label: "Paid" },
  pending: { dot: "var(--warning)", label: "Pending" },
  bank_transfer_pending: { dot: "#3b82f6", label: "Bank transfer" },
  cash_pending: { dot: "var(--primary)", label: "Cash" },
  cancelled: { dot: "var(--error)", label: "Cancelled" },
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function getFirstItemName(snapshot: unknown): string {
  if (
    typeof snapshot === "object" &&
    snapshot !== null &&
    !Array.isArray(snapshot)
  ) {
    const obj = snapshot as Record<string, unknown>;
    if (typeof obj.en === "string" && obj.en) return obj.en;
  }
  return "Item";
}

type Props = {
  propertyId: string | null;
  propertyMenuHref: string | null;
  initialOrders: DashboardOrderRow[];
};

export function RecentOrdersLive({
  propertyId,
  propertyMenuHref,
  initialOrders,
}: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    queueMicrotask(() => setOrders(initialOrders));
  }, [initialOrders]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!propertyId || !isSupabaseRealtimeConfigured()) return;

    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    const channel = supabase
      .channel(`orders-${propertyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Order",
          filter: `propertyId=eq.${propertyId}`,
        },
        () => refresh()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Order",
          filter: `propertyId=eq.${propertyId}`,
        },
        () => refresh()
      )
      .subscribe();

    const poll = window.setInterval(refresh, 30_000);

    return () => {
      window.clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [propertyId, refresh]);

  return (
    <div
      className="overflow-hidden rounded-[20px] border"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        boxShadow:
          "0 1px 3px rgba(28,25,23,0.04), 0 4px 12px -4px rgba(28,25,23,0.06)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h2
          className="text-[15px] font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Recent Orders
        </h2>
        {orders.length > 0 && (
          <span
            className="text-[11px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            {isSupabaseRealtimeConfigured() ? "Live" : "Updates on refresh"}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--surface)" }}
          >
            <Clock
              className="h-8 w-8"
              strokeWidth={1.5}
              style={{ color: "var(--muted-light)" }}
              aria-hidden
            />
          </div>
          <p
            className="mt-4 text-[15px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            No orders yet
          </p>
          <p
            className="mt-1.5 max-w-[280px] text-center text-[13px] leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Once guests scan your QR code and place orders, they&apos;ll appear
            here in real time.
          </p>
          {propertyMenuHref && (
            <Link
              href={propertyMenuHref}
              className="mt-5 flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--primary)" }}
            >
              Set up your menu
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? {
              dot: "var(--muted-light)",
              label: order.status,
            };
            const firstItem = order.items[0];
            const itemLabel = firstItem
              ? `${getFirstItemName(firstItem.itemNameSnapshot)}${firstItem.quantity > 1 ? ` ×${firstItem.quantity}` : ""}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`
              : "—";

            return (
              <li
                key={order.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: statusCfg.dot }}
                  aria-label={statusCfg.label}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13.5px] font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {order.guestName ?? "Guest"} — {itemLabel}
                  </p>
                  <p
                    className="mt-0.5 text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    {statusCfg.label}
                    {order.paymentMethod
                      ? ` · ${order.paymentMethod === "bank_transfer" ? "Bank" : order.paymentMethod === "stripe" ? "Card" : "Cash"}`
                      : ""}
                  </p>
                </div>
                <span
                  className="shrink-0 text-[13.5px] font-semibold tabular-nums"
                  style={{ color: "var(--foreground)" }}
                >
                  {order.currency === "EUR" ? "€" : `${order.currency} `}
                  {Number(order.totalAmount).toFixed(2)}
                </span>
                <span
                  className="shrink-0 text-[12px]"
                  style={{ color: "var(--muted-light)" }}
                >
                  {formatRelativeTime(order.createdAt)}
                </span>
                {(order.status === "cash_pending" ||
                  order.status === "bank_transfer_pending") && (
                  <MarkOrderPaidButton orderId={order.id} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
