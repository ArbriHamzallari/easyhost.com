"use client";

import { useState } from "react";
import { Home, Building2, Users, MoreHorizontal } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

const OPTIONS = [
  {
    value: "airbnb_host",
    icon: Home,
    label: "Airbnb / Short-term rental",
    description: "I rent out my place on Airbnb, Booking.com, or similar platforms.",
  },
  {
    value: "hotel_owner",
    icon: Building2,
    label: "Hotel or B&B",
    description: "I own or manage a hotel, guesthouse, or bed & breakfast.",
  },
  {
    value: "vacation_rental_manager",
    icon: Users,
    label: "Property manager",
    description: "I manage rentals on behalf of other owners.",
  },
  {
    value: "other",
    icon: MoreHorizontal,
    label: "Something else",
    description: "My hosting situation doesn't fit the above.",
  },
] as const;

export function IntentPicker({ name }: { name: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      {/* Hidden input sent with the form */}
      <input type="hidden" name={name} value={selected ?? ""} />

      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value, icon: Icon, label, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            className={`group flex items-start gap-4 rounded-[16px] border p-5 text-left transition-all ${
              selected === value
                ? "border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]"
                : "border-[var(--border)] bg-white hover:border-[var(--primary)] hover:shadow-sm"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                selected === value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] group-hover:bg-[var(--primary-soft)] group-hover:text-[var(--primary)]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[var(--foreground)]">{label}</div>
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--muted)]">{description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button type="submit" size="lg" className="min-w-[200px]" disabled={!selected}>
          Continue
        </Button>
      </div>
    </div>
  );
}
