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