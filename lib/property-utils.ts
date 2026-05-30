/**
 * Maps a property type slug (from the database) to the display word
 * used in guest-facing copy, e.g. "Everything in your [villa], on demand."
 *
 * On the guest app (/m/[slug]) this value is static, pulled from the property
 * record. On the landing page hero it is animated via the PropertyTicker.
 */
export function getPropertyWord(type: string): string {
  const map: Record<string, string> = {
    apartment: "apartment",
    rental: "rental",
    villa: "villa",
    suite: "suite",
    cottage: "cottage",
    hotel: "hotel room",
    guesthouse: "guesthouse",
    hostel: "hostel room",
    beachfront: "beachfront property",
    ecotourism: "eco lodge",
  };
  return map[type] ?? "property";
}
