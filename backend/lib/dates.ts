/**
 * Returns the number of whole days remaining until `date`, never negative.
 * Returns 0 if `date` is null or in the past.
 */
export function daysUntil(date: Date | null): number {
  if (!date) return 0;
  const ms = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
