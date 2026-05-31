/** @description EasyHost collapsible setup checklist — client component receiving serialisable data from the server page */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Palette,
  CreditCard,
  UtensilsCrossed,
  QrCode,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChecklistKey = "branding" | "payment" | "menu" | "qr";

export interface ChecklistItemData {
  key: ChecklistKey;
  done: boolean;
  href: string;
}

interface SetupChecklistProps {
  items: ChecklistItemData[];
  completedCount: number;
}

// ---------------------------------------------------------------------------
// Static metadata (icons can live client-side since keys are serialisable)
// ---------------------------------------------------------------------------

const STEP_META: Record<
  ChecklistKey,
  { label: string; description: string; icon: React.ElementType }
> = {
  branding: {
    label: "Set up branding",
    description: "Add your logo and brand color",
    icon: Palette,
  },
  payment: {
    label: "Configure payment",
    description: "Add your IBAN or enable cash",
    icon: CreditCard,
  },
  menu: {
    label: "Add your first menu item",
    description: "Start building your menu",
    icon: UtensilsCrossed,
  },
  qr: {
    label: "Generate your QR code",
    description: "Print and place it in your rental",
    icon: QrCode,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SetupChecklist({ items, completedCount }: SetupChecklistProps) {
  const total = items.length;
  const allDone = completedCount === total;

  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("easyhost-setup-dismissed") === "true"
  );
  const [open, setOpen] = useState(() => {
    const wasDismissed =
      typeof window !== "undefined" &&
      localStorage.getItem("easyhost-setup-dismissed") === "true";
    return !(allDone && !wasDismissed);
  });

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("easyhost-setup-dismissed", "true");
  }

  if (dismissed) return null;

  return (
    <div
      className="overflow-hidden rounded-[18px] border transition-all duration-200"
      style={{
        background: "var(--card)",
        borderColor: allDone ? "var(--success)" : "var(--border)",
        boxShadow: "0 1px 3px rgba(28,25,23,0.04), 0 4px 12px -4px rgba(28,25,23,0.06)",
      }}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {/* Progress ring / check */}
          {allDone ? (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--success)" }}
            >
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
          ) : (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-semibold"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
            >
              {completedCount}
            </div>
          )}

          <div>
            <p
              className="text-[14px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {allDone ? "Setup complete!" : "Setup checklist"}
            </p>
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>
              {allDone
                ? "You're all set — your QR code is ready to print"
                : `${completedCount} of ${total} steps done`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress bar — compact, shown in header */}
          {!allDone && (
            <div
              className="hidden h-1.5 w-24 overflow-hidden rounded-full sm:block"
              style={{ background: "var(--surface)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / total) * 100}%`,
                  background: "var(--primary)",
                }}
              />
            </div>
          )}

          {/* Dismiss when done */}
          {allDone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              className="rounded-lg p-1 transition-colors"
              style={{ color: "var(--muted-light)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--muted-light)")
              }
              aria-label="Dismiss setup checklist"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Chevron */}
          <span style={{ color: "var(--muted-light)" }}>
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>

      {/* Expandable step list */}
      {open && (
        <>
          <div
            className="mx-5 mb-1"
            style={{ height: 1, background: "var(--border)" }}
          />

          {/* Desktop: horizontal steps | Mobile: vertical */}
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const meta = STEP_META[item.key];
              const Icon = meta.icon;

              return (
                <div key={item.key}>
                  {item.done ? (
                    <div
                      className="flex items-start gap-2.5 rounded-[12px] p-3"
                      style={{ background: "var(--surface)" }}
                    >
                      <div
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--success)" }}
                      >
                        <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[12.5px] font-medium line-through"
                          style={{ color: "var(--muted)" }}
                        >
                          {meta.label}
                        </p>
                        <p
                          className="mt-0.5 text-[11px]"
                          style={{ color: "var(--muted-light)" }}
                        >
                          {meta.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="group flex items-start gap-2.5 rounded-[12px] p-3 transition-colors"
                      style={{ background: "var(--surface)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--primary-soft)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "var(--surface)";
                      }}
                    >
                      <div
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        <Icon className="h-3 w-3" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[12.5px] font-medium"
                          style={{ color: "var(--foreground)" }}
                        >
                          {meta.label}
                        </p>
                        <p
                          className="mt-0.5 text-[11px]"
                          style={{ color: "var(--muted)" }}
                        >
                          {meta.description}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: "var(--primary)" }}
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pb-1" />
        </>
      )}
    </div>
  );
}

export default SetupChecklist;
