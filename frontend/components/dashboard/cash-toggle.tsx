"use client";

import { useState } from "react";

interface CashToggleProps {
  name: string;
  defaultChecked?: boolean;
}

export function CashToggle({ name, defaultChecked = true }: CashToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="relative flex cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </label>
  );
}
