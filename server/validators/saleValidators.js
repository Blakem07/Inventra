/**
 * Validates the request body for POST /sales.
 *
 * This function enforces the public API contract before any
 * sale processing or inventory deduction logic is executed.
 *
 * Validation guarantees:
 * - Body must exist and be an object.
 * - payment_method must be one of: Cash, GCash, Other.
 * - performed_by must be a non-empty string.
 * - items must be a non-empty array.
 * - Each item must include:
 *   - product_id as a non-empty string.
 *   - quantity as a positive number (>= 1).
 *
 * On failure, throws an Error with status 400.
 * The validateBody middleware catches and forwards the error.
 */
export function validateSale(body) {
  const allowedPay = ["Cash", "GCash", "Other"];
  if (!body || typeof body !== "object") {
    const e = new Error("Invalid body");
    e.status = 400;
    throw e;
  }
  if (!allowedPay.includes(body.payment_method)) {
    const e = new Error("payment_method invalid");
    e.status = 400;
    throw e;
  }
  if (typeof body.performed_by !== "string" || body.performed_by.trim().length === 0) {
    const e = new Error("performed_by is required");
    e.status = 400;
    throw e;
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    const e = new Error("items must be a non-empty array");
    e.status = 400;
    throw e;
  }
  for (const item of body.items) {
    if (typeof item.product_id !== "string" || item.product_id.length === 0) {
      const e = new Error("item.product_id is required");
      e.status = 400;
      throw e;
    }
    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      const e = new Error("item.quantity must be >= 1");
      e.status = 400;
      throw e;
    }
  }
}
