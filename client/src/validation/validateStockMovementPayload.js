export default function validateStockMovementPayload(values) {
  const errors = {};

  const productId = values?.productId?.trim();
  const movementType = values?.movementType?.trim().toUpperCase();
  const quantity = Number(values?.quantity);
  const performedBy = values?.performedBy?.trim();
  const reason = values?.reason?.trim();
  const note = values?.note?.trim();

  if (!productId) {
    errors.productId = "Product is required";
  }

  if (!movementType || !["IN", "OUT", "ADJUST"].includes(movementType)) {
    errors.movementType = "Movement type must be IN, OUT, or ADJUST";
  }

  if (!Number.isFinite(quantity) || quantity < 1) {
    errors.quantity = "Quantity at 1 or more required";
  }

  if (!performedBy || performedBy === "") {
    errors.performedBy = "Performed by is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      productId,
      movementType,
      quantity,
      performedBy,
      reason,
      note,
    },
  };
}
