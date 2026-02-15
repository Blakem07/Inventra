import mongoose from "mongoose";
/**
 * Validates the request body for POST /stock/movements.
 *
 * This function enforces the public API contract before any
 * inventory mutation logic is executed.
 *
 * Validation guarantees:
 * - Body must exist and be an object.
 * - product_id must be a non-empty string.
 * - movement_type must be one of: IN, OUT, ADJUST.
 * - quantity must be a positive number (> 0).
 * - performed_by must be a non-empty string.
 *
 * On failure, throws an Error with status 400.
 * The validateBody middleware catches and forwards the error.
 */
export function validateStockMovement(body) {
  const allowed = ["IN", "OUT", "ADJUST"];
  if (!body || typeof body !== "object") {
    const e = new Error("Invalid body");
    e.status = 400;
    throw e;
  }
  if (typeof body.product_id !== "string" || body.product_id.length === 0) {
    const e = new Error("product_id is required");
    e.status = 400;
    throw e;
  }
  if (!mongoose.Types.ObjectId.isValid(body.product_id)) {
    const e = new Error("The product id provided is invalid.");
    e.status = 400;
    throw e;
  }
  if (!allowed.includes(body.movement_type)) {
    const e = new Error("movement_type must be IN, OUT, or ADJUST");
    e.status = 400;
    throw e;
  }
  if (!Number.isFinite(body.quantity) || body.quantity <= 0) {
    const e = new Error("quantity must be > 0");
    e.status = 400;
    throw e;
  }
  if (typeof body.performed_by !== "string" || body.performed_by.trim().length === 0) {
    const e = new Error("performed_by is required");
    e.status = 400;
    throw e;
  }
}
