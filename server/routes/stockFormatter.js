/**
 * Converts a stock movement payload from API format (camelCase)
 * to database format (snake_case).
 */
export function formatMovementToDB(payload) {
  return {
    product_id: payload.productId,
    movement_type: payload.movementType,
    quantity: payload.quantity,
    performed_by: payload.performedBy,
    reason: payload.reason,
    note: payload.note,
  };
}

/**
 * Converts a stock movement payload from database format (snake_case)
 * to API format (camelCase).
 *
 * If an array is passed in, it will map over the array and
 * convert each payload to API format.
 *
 * @param {object|array} payload - Stock movement payload to convert.
 * @returns {object|array} Converted stock movement payload.
 */

export function formatMovementResponseForFE(payload) {
  if (Array.isArray(payload)) {
    return payload.map(formatMovementResponseForFE);
  }

  return {
    id: payload._id,
    occurredAt: payload.occurred_at,
    productId: payload.product_id,
    movementType: payload.movement_type,
    quantityChange: payload.quantity_change,
    saleId: payload.sale_id,
    performedBy: payload.performed_by,
    reason: payload.reason,
    note: payload.note,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}
