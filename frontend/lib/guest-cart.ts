export type GuestCartLine = {
  menuItemId: string;
  quantity: number;
};

export type GuestMenuItem = {
  id: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  category: string;
  imageUrl: string | null;
  price: string;
  currency: string;
  stockQuantity: number;
};

export function cartStorageKey(slug: string) {
  return `easyhost-cart-${slug}`;
}

export function readCart(slug: string): GuestCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(cartStorageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is GuestCartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as GuestCartLine).menuItemId === "string" &&
        typeof (l as GuestCartLine).quantity === "number" &&
        (l as GuestCartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

export function writeCart(slug: string, lines: GuestCartLine[]) {
  if (typeof window === "undefined") return;
  if (lines.length === 0) {
    localStorage.removeItem(cartStorageKey(slug));
    return;
  }
  localStorage.setItem(cartStorageKey(slug), JSON.stringify(lines));
}

export function clearCart(slug: string) {
  writeCart(slug, []);
}

export function getItemName(
  name: Record<string, string>,
  locale: string
): string {
  return name[locale] ?? name.en ?? Object.values(name)[0] ?? "";
}
