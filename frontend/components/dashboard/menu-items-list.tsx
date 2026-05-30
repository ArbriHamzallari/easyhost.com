"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Eye, EyeOff, Package } from "lucide-react";
import type { MenuItemRow, MenuErrorCode, MenuResult } from "@/backend/lib/menu";

type Props = {
  menuId: string;
  items: MenuItemRow[];
  locale: string;
  deleteItem: (itemId: string) => Promise<MenuResult>;
  toggleAvailability: (itemId: string) => Promise<MenuResult>;
  updateOrder: (
    updates: { id: string; displayOrder: number }[],
    menuId: string
  ) => Promise<MenuResult>;
};

function SortableItem({
  item,
  locale,
  deleteItem,
  toggleAvailability,
}: {
  item: MenuItemRow;
  locale: string;
  deleteItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const displayName =
    (item.name as Record<string, string>)[locale] ??
    (item.name as Record<string, string>)["en"] ??
    "Untitled";

  const stockWarning = item.stockQuantity <= item.lowStockThreshold;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-white p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="shrink-0 cursor-grab touch-none text-[var(--muted)] hover:text-[var(--foreground)] active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-[10px] object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface)]">
          <Package className="h-5 w-5 text-[var(--muted)]" strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-medium text-[var(--foreground)]">
            {displayName}
          </span>
          {!item.isAvailable && (
            <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--muted)]">
              Hidden
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[11.5px] text-[var(--muted)]">
          <span className="capitalize">{item.category}</span>
          <span>€{parseFloat(item.price).toFixed(2)}</span>
          <span
            className={
              stockWarning ? "font-medium text-[var(--warning)]" : ""
            }
          >
            {item.stockQuantity} in stock
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => toggleAvailability(item.id)}
          aria-label={item.isAvailable ? "Hide item" : "Show item"}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
        >
          {item.isAvailable ? (
            <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => deleteItem(item.id)}
          aria-label="Delete item"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)] transition-colors"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export function MenuItemsList({
  menuId,
  items: initialItems,
  locale,
  deleteItem,
  toggleAvailability,
  updateOrder,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    startTransition(async () => {
      await updateOrder(
        reordered.map((item, idx) => ({ id: item.id, displayOrder: idx })),
        menuId
      );
    });
  }

  async function handleDelete(itemId: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const result = await deleteItem(itemId);
    if (result.ok) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      router.refresh();
    }
  }

  async function handleToggle(itemId: string) {
    const result = await toggleAvailability(itemId);
    if (result.ok) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i
        )
      );
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-[var(--border)] bg-white p-8 text-center">
        <p className="text-[13.5px] text-[var(--muted)]">
          No items yet. Add your first item above.
        </p>
      </div>
    );
  }

  // Group by category preserving order
  const categories: string[] = [];
  const byCategory: Record<string, MenuItemRow[]> = {};
  for (const item of items) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
      categories.push(item.category);
    }
    byCategory[item.category]!.push(item);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {cat}
              </h3>
              <ul className="space-y-2">
                {byCategory[cat]!.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    locale={locale}
                    deleteItem={handleDelete}
                    toggleAvailability={handleToggle}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
