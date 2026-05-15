"use client";

import { useState } from "react";

const PRESETS = [
  "#FF5A1F", // EasyHost orange
  "#E54A12",
  "#D97706", // Amber
  "#059669", // Emerald
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#DB2777", // Pink
  "#374151", // Slate
];

interface ColorPickerProps {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
}

export function ColorPicker({ name, label, hint, defaultValue = "#FF5A1F" }: ColorPickerProps) {
  const [color, setColor] = useState(defaultValue);

  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--foreground)]">{label}</label>
      {hint && <p className="mt-0.5 text-[11.5px] text-[var(--muted)]">{hint}</p>}

      <input type="hidden" name={name} value={color} />

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setColor(preset)}
            style={{ backgroundColor: preset }}
            className={`h-8 w-8 rounded-full transition-all ${
              color === preset
                ? "ring-2 ring-[var(--foreground)] ring-offset-2"
                : "hover:scale-110"
            }`}
            title={preset}
          />
        ))}

        {/* Custom color input */}
        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-[var(--border)] text-[10px] text-[var(--muted)] hover:border-[var(--primary)]">
          <span>+</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        {/* Swatch preview */}
        <div className="ml-2 flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full border border-[var(--border)]"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-[12px] text-[var(--muted)]">{color}</span>
        </div>
      </div>
    </div>
  );
}
