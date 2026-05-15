"use client";

import { useState } from "react";
import { Home, Building2, Trees, Star, Hotel, Users, Waves, MoreHorizontal } from "lucide-react";

const TYPES = [
  { value: "apartment", icon: Home, label: "Apartment" },
  { value: "villa", icon: Star, label: "Villa" },
  { value: "cottage", icon: Trees, label: "Cottage" },
  { value: "suite", icon: Hotel, label: "Suite" },
  { value: "hotel", icon: Building2, label: "Hotel" },
  { value: "hostel", icon: Users, label: "Hostel" },
  { value: "beachfront", icon: Waves, label: "Beachfront" },
  { value: "other", icon: MoreHorizontal, label: "Other" },
] as const;

interface PropertyTypeGridProps {
  name: string;
  defaultValue?: string;
}

export function PropertyTypeGrid({ name, defaultValue }: PropertyTypeGridProps) {
  const [selected, setSelected] = useState(defaultValue ?? "apartment");

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {TYPES.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            className={`flex flex-col items-center gap-2 rounded-[14px] border p-3 text-center transition-all sm:p-4 ${
              selected === value
                ? "border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]"
                : "border-[var(--border)] bg-white hover:border-[var(--primary)] hover:shadow-sm"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors sm:h-10 sm:w-10 ${
                selected === value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)]"
              }`}
            >
              <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-medium text-[var(--foreground)] sm:text-[12px]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
