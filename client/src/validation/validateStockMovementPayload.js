/**
 * Validates and normalizes stock movement input.
 *
 * @param {Object} values
 * @param {string} [values.productId]
 * @param {string} [values.movementType]
 * @param {string|number} [values.quantity]
 * @param {string} [values.performedBy]
 * @param {string} [values.reason]
 * @param {string} [values.note]
 *
 * @returns {{
 *   errors?: Object.<string, string>,
 *   data?: {
 *     productId: string,
 *     movementType: "IN"|"OUT"|"ADJUST",
 *     quantity: number,
 *     performedBy: string,
 *     reason: string|undefined,
 *     note: string|undefined
 *   }
 * }}
 */
export default function validateStockMovementPayload(values) {
  const errors = {};

  const productId = values?.productId?.trim();
  const movementType = values?.movementType?.trim().toUpperCase();
  const quantityValue = values?.quantity;
  const quantity = Number(quantityValue);
  const performedBy = values?.performedBy?.trim();
  const reason = values?.reason?.trim();
  const note = values?.note?.trim();

  const isValidMovementType = ["IN", "OUT", "ADJUST"].includes(movementType);
  const isAdjustMovement = movementType === "ADJUST";

  if (!productId) {
    errors.productId = "Product is required";
  }

  if (!movementType || !isValidMovementType) {
    errors.movementType = "Movement type must be IN, OUT, or ADJUST";
  }

  if (quantityValue === "" || quantityValue === null || quantityValue === undefined) {
    errors.quantity = "Quantity is required";
  } else if (!Number.isFinite(quantity)) {
    errors.quantity = "Quantity must be a number";
  } else if (isAdjustMovement && quantity < 0) {
    errors.quantity = "Quantity must be 0 or above";
  } else if (!isAdjustMovement && quantity < 1) {
    errors.quantity = "Quantity above 0 is required";
  }

  if (!performedBy) {
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
