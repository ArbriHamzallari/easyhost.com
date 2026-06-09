"use client";

import { useState, useTransition } from "react";
import { updateMenuItemStock } from "@/backend/lib/inventory-actions";
import type { InventoryRow } from "@/lib/inventory-types";
import { Button } from "@/frontend/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";

type InventoryTableProps = {
  propertyId: string;
  items: InventoryRow[];
};

export function InventoryTable({ propertyId, items: initial }: InventoryTableProps) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSave = (item: InventoryRow, stock: number, threshold: number) => {
    setError(null);
    startTransition(async () => {
      const result = await updateMenuItemStock({
        propertyId,
        menuItemId: item.id,
        stockQuantity: stock,
        lowStockThreshold: threshold,
      });
      if (!result.ok) {
        setError(
          result.error === "subscription_locked"
            ? "Activate a plan to update inventory."
            : "Could not save stock level."
        );
        return;
      }
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                stockQuantity: stock,
                lowStockThreshold: threshold,
                isAvailable: stock > 0,
              }
            : row
        )
      );
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[16px] border border-[var(--border)] bg-white p-10 text-center">
        <Package className="mx-auto h-10 w-10 text-[var(--muted)]" strokeWidth={1.5} />
        <p className="mt-3 text-[15px] font-medium text-[var(--foreground)]">
          No menu items yet
        </p>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Add items in the menu builder to track stock here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-[10px] bg-[#FFE8DE] px-4 py-2 text-[13px] text-[var(--error)]">
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-[16px] border border-[var(--border)] bg-white">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[12px] uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Low-stock at</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InventoryRowEditor
                key={item.id}
                item={item}
                pending={pending}
                onSave={handleSave}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryRowEditor({
  item,
  pending,
  onSave,
}: {
  item: InventoryRow;
  pending: boolean;
  onSave: (item: InventoryRow, stock: number, threshold: number) => void;
}) {
  const [stock, setStock] = useState(item.stockQuantity);
  const [threshold, setThreshold] = useState(item.lowStockThreshold);
  const isLow = stock > 0 && stock <= threshold;
  const isOut = stock === 0;

  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {(isLow || isOut) && (
            <AlertTriangle
              className={`h-4 w-4 shrink-0 ${isOut ? "text-[var(--error)]" : "text-[var(--warning)]"}`}
              aria-hidden="true"
            />
          )}
          <span className="font-medium text-[var(--foreground)]">{item.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 capitalize text-[var(--muted)]">{item.category}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="w-20 rounded-[8px] border border-[var(--border)] px-2 py-1.5 text-[13px]"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) =>
            setThreshold(Math.max(0, parseInt(e.target.value, 10) || 0))
          }
          className="w-20 rounded-[8px] border border-[var(--border)] px-2 py-1.5 text-[13px]"
        />
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => onSave(item, stock, threshold)}
        >
          Save
        </Button>
      </td>
    </tr>
  );
}
