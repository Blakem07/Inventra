/**
 * Converts a sale payload from API format (camelCase)
 * to database format (snake_case).
 */
export function formatSaleToDB(payload) {
  return {
    payment_method: payload.paymentMethod,
    performed_by: payload.performedBy,
    note: payload.note,
    items: payload.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    })),
  };
}

/**
 * Maps a sale service response from DB format (snake_case)
 * to API response format (camelCase).
 */
export function formatSaleResponseForFE(sale) {
  return {
    saleId: sale.sale_id?.toString(),
    totalAmount: sale.total_amount,
  };
}
