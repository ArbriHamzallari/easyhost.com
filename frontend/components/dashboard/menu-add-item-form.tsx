"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { CloudinaryUpload } from "./cloudinary-upload";
import type { MenuItemInput, MenuErrorCode, AppLocale } from "@/backend/lib/menu";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  al: "Albanian",
  it: "Italian",
  de: "German",
};

const CATEGORY_PRESETS = [
  { value: "beverages", label: "Beverages" },
  { value: "snacks", label: "Snacks" },
  { value: "alcohol", label: "Alcohol" },
  { value: "services", label: "Services" },
];

type Props = {
  menuId: string;
  currency: string;
  defaultLang: AppLocale;
  addItem: (
    menuId: string,
    data: MenuItemInput
  ) => Promise<{ ok: true; itemId: string } | { ok: false; error: MenuErrorCode }>;
};

export function MenuAddItemForm({ menuId, currency, defaultLang, addItem }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [customCategory, setCustomCategory] = useState("");
  const [categoryMode, setCategoryMode] = useState<"preset" | "custom">("preset");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const sourceLang = (fd.get("sourceLang") as AppLocale) ?? defaultLang;
    const description = (fd.get("description") as string).trim() || undefined;
    // CloudinaryUpload writes its URL to a hidden input named "imageUrl"
    const imageUrl = (fd.get("imageUrl") as string).trim() || undefined;
    const category =
      categoryMode === "custom"
        ? customCategory.trim()
        : (fd.get("category") as string);
    const priceRaw = parseFloat(fd.get("price") as string);
    const stockRaw = parseInt(fd.get("stockQuantity") as string, 10);
    const thresholdRaw = fd.get("lowStockThreshold")
      ? parseInt(fd.get("lowStockThreshold") as string, 10)
      : undefined;

    if (!name || !category || isNaN(priceRaw) || isNaN(stockRaw)) {
      setError("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      const result = await addItem(menuId, {
        name,
        sourceLang,
        description,
        category,
        price: priceRaw,
        imageUrl,
        stockQuantity: stockRaw,
        lowStockThreshold: thresholdRaw,
      });

      if (result.ok) {
        formRef.current?.reset();
        setCustomCategory("");
        setCategoryMode("preset");
        router.refresh();
      } else {
        setError("Failed to add item. Please try again.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Add item</h2>

      {error && (
        <p className="mt-3 rounded-[8px] bg-[var(--error)]/10 px-3 py-2 text-[12.5px] text-[var(--error)]">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-4">
        {/* Name + language */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[12px] font-medium text-[var(--foreground)]">
              Item name <span className="text-[var(--error)]">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              maxLength={200}
              placeholder="e.g. Coca-Cola"
              className="mt-1 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>
          <div className="w-36">
            <label className="block text-[12px] font-medium text-[var(--foreground)]">
              Typing in
            </label>
            <select
              name="sourceLang"
              defaultValue={defaultLang}
              className="mt-1 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            >
              {(Object.entries(LOCALE_LABELS) as [AppLocale, string][]).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[12px] font-medium text-[var(--foreground)]">
            Description{" "}
            <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea
            name="description"
            rows={2}
            maxLength={500}
            placeholder="Short description guests will see"
            className="mt-1 w-full resize-none rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-[12px] font-medium text-[var(--foreground)]">
            Category <span className="text-[var(--error)]">*</span>
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {CATEGORY_PRESETS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setCategoryMode("preset");
                  const sel = document.querySelector<HTMLSelectElement>(
                    "select[name='category']"
                  );
                  if (sel) sel.value = cat.value;
                }}
                className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                  categoryMode === "preset"
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCategoryMode("custom")}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                categoryMode === "custom"
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              + Custom
            </button>
          </div>

          {categoryMode === "preset" ? (
            <select name="category" defaultValue="beverages" className="sr-only">
              {CATEGORY_PRESETS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Type your category name"
              required
              className="mt-2 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          )}
        </div>

        {/* Price + stock */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground)]">
              Price ({currency}) <span className="text-[var(--error)]">*</span>
            </label>
            <input
              name="price"
              type="number"
              required
              min="0.01"
              max="99999"
              step="0.01"
              placeholder="0.00"
              className="mt-1 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground)]">
              Stock <span className="text-[var(--error)]">*</span>
            </label>
            <input
              name="stockQuantity"
              type="number"
              required
              min="0"
              defaultValue="10"
              className="mt-1 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--foreground)]">
              Alert when below
            </label>
            <input
              name="lowStockThreshold"
              type="number"
              min="0"
              defaultValue="3"
              className="mt-1 w-full rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
            />
          </div>
        </div>

        {/* Image */}
        <CloudinaryUpload
          name="imageUrl"
          label="Photo"
          hint="Optional — items with photos convert better."
          aspectRatio="square"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-[var(--primary)] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60 transition-colors"
        >
          {pending ? "Adding…" : "Add item"}
        </button>
        <p className="text-[12px] text-[var(--muted)]">
          Name auto-translates to all 4 languages.
        </p>
      </div>
    </form>
  );
}
