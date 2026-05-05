import { subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { BUSINESS_TIME_ZONE, BUSINESS_DATE_FORMAT } from "../../config/businessTime";

function formatBusinessDate(date) {
  return formatInTimeZone(date, BUSINESS_TIME_ZONE, BUSINESS_DATE_FORMAT);
}

export function getDateRange(rangeType, now = new Date()) {
  if (rangeType === "today") {
    const today = formatBusinessDate(now);

    return {
      from: today,
      to: today,
    };
  }

  if (rangeType === "last7") {
    return {
      from: formatBusinessDate(subDays(now, 6)),
      to: formatBusinessDate(now),
    };
  }

  if (rangeType === "last30") {
    return {
      from: formatBusinessDate(subDays(now, 29)),
      to: formatBusinessDate(now),
    };
  }

  if (rangeType === "thisMonth") {
    return {
      from: formatBusinessDate(startOfMonth(now)),
      to: formatBusinessDate(now),
    };
  }

  if (rangeType === "lastMonth") {
    const lastMonth = subMonths(now, 1);

    return {
      from: formatBusinessDate(startOfMonth(lastMonth)),
      to: formatBusinessDate(endOfMonth(lastMonth)),
    };
  }

  return {
    from: "",
    to: "",
  };
}
