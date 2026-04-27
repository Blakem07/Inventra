/**
 * Parses a normal timestamp filter value.
 *
 * This is for fields such as `createdAt`, where the incoming value should be
 * treated as a JavaScript Date. Do not use this for business-day report filters.
 *
 * @param {unknown} value
 * @returns {Date|undefined|null}
 */
export function parseDateParam(value) {
  if (value === undefined) return undefined;

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return null;

  return d;
}

/**
 * Builds a Mongo date range using normal JavaScript Date parsing.
 *
 * Suitable for timestamp fields such as `createdAt`. Date-only strings are
 * parsed as UTC midnight, so this is not suitable for Philippines business-day
 * reports.
 *
 * @param {{ from?: string, to?: string }} params
 * @returns {{ range?: { $gte?: Date, $lte?: Date }, error?: { status: number, message: string } }}
 */
export function buildCreatedAtRange({ from, to }) {
  const fromDate = parseDateParam(from);
  const toDate = parseDateParam(to);

  if (from !== undefined && fromDate === null) {
    return { error: { status: 400, message: "Invalid 'from' date" } };
  }

  if (to !== undefined && toDate === null) {
    return { error: { status: 400, message: "Invalid 'to' date" } };
  }

  if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
    return { error: { status: 400, message: "'from' must be <= 'to'" } };
  }

  const range = {};

  if (fromDate) range.$gte = fromDate;
  if (toDate) range.$lte = toDate;

  if (Object.keys(range).length === 0) {
    return { range: undefined };
  }

  return { range };
}

const MANILA_UTC_OFFSET_HOURS = 8;
const MANILA_UTC_OFFSET_MS = MANILA_UTC_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Checks for a YYYY-MM-DD business date key.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDateKey(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Splits a YYYY-MM-DD date key into numeric parts.
 *
 * @param {string} dateKey
 * @returns {{ year: number, month: number, day: number }}
 */
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return {
    year,
    month,
    day,
  };
}

/**
 * Adds one calendar day to a YYYY-MM-DD date key.
 *
 * Used to turn an inclusive `to` date into an exclusive upper bound.
 *
 * @param {string} dateKey
 * @returns {string}
 */
export function addOneDayToDateKey(dateKey) {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + 1);

  return date.toISOString().slice(0, 10);
}

/**
 * Converts midnight at the start of a Manila business day to UTC.
 *
 * Example: 2026-04-27 in Manila starts at 2026-04-26T16:00:00.000Z.
 *
 * @param {string} dateKey - YYYY-MM-DD
 * @returns {Date}
 */
export function businessDateKeyToUtcStart(dateKey) {
  const { year, month, day } = parseDateKey(dateKey);

  const utcMidnight = Date.UTC(year, month - 1, day);

  return new Date(utcMidnight - MANILA_UTC_OFFSET_MS);
}

/**
 * Builds a Mongo `occurred_at` range from inclusive Manila business dates.
 *
 * The frontend sends date keys like `{ from: "2026-04-27", to: "2026-04-27" }`.
 * Mongo stores UTC timestamps, so the range uses Manila midnight converted to
 * UTC and an exclusive upper bound.
 *
 * @param {{ from?: string, to?: string }} params
 * @returns {{ range?: { $gte: Date, $lt: Date }, error?: { status: number, message: string } }}
 */
export function buildBusinessDateRange({ from, to }) {
  if (!isDateKey(from)) {
    return { error: { status: 400, message: "Invalid 'from' date" } };
  }

  if (!isDateKey(to)) {
    return { error: { status: 400, message: "Invalid 'to' date" } };
  }

  if (from > to) {
    return { error: { status: 400, message: "'from' must be <= 'to'" } };
  }

  const toExclusive = addOneDayToDateKey(to);

  return {
    range: {
      $gte: businessDateKeyToUtcStart(from),
      $lt: businessDateKeyToUtcStart(toExclusive),
    },
  };
}
