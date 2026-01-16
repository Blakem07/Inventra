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
