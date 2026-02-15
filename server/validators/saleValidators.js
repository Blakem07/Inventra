import mongoose from "mongoose";
/**
 * Validates request body for POST /sales.
 *
 * Ensures:
 * - Body is a non-null object (not an array).
 * - payment_method is one of: Cash, GCash, Other.
 * - performed_by is a non-empty trimmed string.
 * - items is a non-empty array of objects.
 * - Each item contains:
 *   - product_id: non-empty string and valid MongoDB ObjectId.
 *   - quantity: integer >= 1.
 *
 * Throws Error with status 400 on validation failure.
 */
export function validateSale(body) {
  const allowedPay = ["Cash", "GCash", "Other"];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
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
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      const e = new Error("Each item must be an object");
      e.status = 400;
      throw e;
    }

    if (typeof item.product_id !== "string" || item.product_id.trim().length === 0) {
      const e = new Error("item.product_id is required");
      e.status = 400;
      throw e;
    }

    if (!mongoose.Types.ObjectId.isValid(item.product_id)) {
      const e = new Error("The product id provided is invalid.");
      e.status = 400;
      throw e;
    }

    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      const e = new Error("item.quantity must be >= 1");
      e.status = 400;
      throw e;
    }

    if (!Number.isInteger(item.quantity)) {
      const e = new Error("item.quantity must be an integer");
      e.status = 400;
      throw e;
    }
  }
}
