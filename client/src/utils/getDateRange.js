import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

/**
 * Returns a date range object with `from` and `to` properties
 * in the format "yyyy-MM-dd" based on the given range type.
 *
 * Supported range types are:
 * - "today": returns the current date as both from and to
 * - "last7": returns the last 7 days from the current date as the range
 * - "last30": returns the last 30 days from the current date as the range
 * - "thisMonth": returns the current month as the range
 * - "lastMonth": returns the previous month as the range
 *
 * If an unsupported range type is given, an empty date range object is returned.
 * @param {string} rangeType
 * @returns {Object} { from: string, to: string }
 */
export function getDateRange(rangeType) {
  const today = new Date();

  if (rangeType === "today") {
    return {
      from: format(today, "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    };
  }

  if (rangeType === "last7") {
    return {
      from: format(subDays(today, 6), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    };
  }

  if (rangeType === "last30") {
    return {
      from: format(subDays(today, 29), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    };
  }

  if (rangeType === "thisMonth") {
    return {
      from: format(startOfMonth(today), "yyyy-MM-dd"),
      to: format(today, "yyyy-MM-dd"),
    };
  }

  if (rangeType === "lastMonth") {
    const lastMonth = subMonths(today, 1);

    return {
      from: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
      to: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
    };
  }

  return {
    from: "",
    to: "",
  };
}
