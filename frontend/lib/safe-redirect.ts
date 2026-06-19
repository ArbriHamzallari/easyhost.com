/**
 * Validates a post-auth redirect path — must be a same-origin relative path.
 */
export function safeRedirectPath(
  raw: string | null | undefined,
  fallback: string
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  return trimmed;
}
