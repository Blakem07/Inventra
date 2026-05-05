import mongoose from "mongoose";

/**
 * Validates the request body for POST /stock/movements.
 *
 * This function enforces the public API contract before any
 * inventory mutation logic is executed.
 *
 * Validation guarantees:
 * - Body must exist and be an object.
 * - productId must be a non-empty valid ObjectId string.
 * - movementType must be one of: IN, OUT, ADJUST.
 * - quantity must be a finite number.
 * - IN and OUT require quantity > 0.
 * - ADJUST allows quantity >= 0.
 * - performedBy must be a non-empty string.
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

  if (typeof body.productId !== "string" || body.productId.length === 0) {
    const e = new Error("productId is required");
    e.status = 400;
    throw e;
  }

  if (!mongoose.Types.ObjectId.isValid(body.productId)) {
    const e = new Error("The product id provided is invalid.");
    e.status = 400;
    throw e;
  }

  if (!allowed.includes(body.movementType)) {
    const e = new Error("movementType must be IN, OUT, or ADJUST");
    e.status = 400;
    throw e;
  }

  if (!Number.isFinite(body.quantity)) {
    const e = new Error("quantity must be a finite number");
    e.status = 400;
    throw e;
  }

  if (body.movementType === "ADJUST" && body.quantity < 0) {
    const e = new Error("quantity must be >= 0 for ADJUST");
    e.status = 400;
    throw e;
  }

  if (body.movementType !== "ADJUST" && body.quantity <= 0) {
    const e = new Error("quantity must be > 0");
    e.status = 400;
    throw e;
  }

  if (typeof body.performedBy !== "string" || body.performedBy.trim().length === 0) {
    const e = new Error("performedBy is required");
    e.status = 400;
    throw e;
  }
}
