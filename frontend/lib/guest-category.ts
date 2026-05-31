/** Resolve a menu category slug to a translated label, with a readable fallback. */
export function getCategoryLabel(
  category: string,
  t: (key: string) => string,
  has: (key: string) => boolean
): string {
  const key = `categories.${category}`;
  if (has(key)) return t(key);
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ");
}
