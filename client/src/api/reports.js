import { client } from "./client";

/**
 * Fetches a sales report from the server given a date range.
 *
 * @param {{ from: string, to: string }} options
 * @returns {Promise<Object>}
 */
export async function listSalesReport({ from: startDate, to: endDate }) {
  const urlParams = new URLSearchParams({
    from: startDate,
    to: endDate,
  });

  const response = await client(`/reports/sales?${urlParams.toString()}`);

  const { data, totals, meta } = response;

  return {
    sales: data,
    totals,
    meta,
  };
}

/**
 * Fetches a stock movement report from the server given a date range.
 *
 * @param {{ from: string, to: string }} options
 * @returns {Promise<Object>}
 */
export async function listMovementsReport({ from: startDate, to: endDate }) {
  const urlParams = new URLSearchParams({
    from: startDate,
    to: endDate,
  });

  const response = await client(`/reports/movements?${urlParams.toString()}`);

  const { data, totals, meta } = response;

  return {
    movements: data,
    totals,
    meta,
  };
}
