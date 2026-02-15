/**
 * Parses an optional date parameter.
 *
 * Accepts values supported by the JavaScript Date constructor.
 * Only ISO 8601 date strings are guaranteed to parse consistently
 * across environments. Non-ISO date strings are implementation dependent.
 *
 * @param {unknown} value - Input value to parse.
 * @returns {Date|undefined|null}
 *   Date if parsing succeeds,
 *   undefined if the input is undefined,
 *   null if the input is present but not a valid date.
 */
export function parseDateParam(value) {
  if (value === undefined) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null; // invalid
  return d;
}

/**
 * Builds a MongoDB `createdAt` comparison filter from optional `from` / `to` dates.
 * Validates date format and ordering. Returns `{ range }` for use in `find()`,
 * or `{ error }` on invalid input.
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
