/**
 * Returns a YYYY-MM-DD date key for a given instant, interpreted in a specific timezone.
 *
 * Storage: occurred_at stays UTC (Date).
 * Reporting: this converts that instant to the business local calendar day.
 *
 * @param {Date} date - Instant in time (UTC Date object).
 * @param {string} timeZone - IANA timezone, e.g. "Asia/Manila".
 * @returns {string} YYYY-MM-DD
 */
export function toBusinessDayKey(date, timeZone) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const formatter = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  let year, month, day;
  for (const p of parts) {
    if (p.type === "year") year = p.value;
    if (p.type === "month") month = p.value;
    if (p.type === "day") day = p.value;
  }

  return `${year}-${month}-${day}`;
}
