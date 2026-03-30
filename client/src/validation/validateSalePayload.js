/**
 * Validates and normalizes sale input.
 *
 * @param {Object} values
 * @param {string} [values.performedBy]
 * @param {string} [values.paymentMethod]
 * @param {string} [values.note]
 * @param {Array<{
 *   productId?: string,
 *   quantity?: string|number
 * }>} [values.items]
 *
 * @returns {{
 *   errors?: Object.<string, string>,
 *   data?: {
 *     performedBy: string,
 *     paymentMethod: string,
 *     note: string,
 *     items: Array<{
 *       productId: string,
 *       quantity: number
 *     }>
 *   }
 * }}
 */
export default function validateSalePayload(values) {
  const errors = {};

  const items = values?.items;

  const performedBy = values?.performedBy.trim();
  const paymentMethod = values?.paymentMethod.trim();
  const note = values?.note.trim();

  // Sale item section
  items.forEach((item) => {
    const quantity = Number(item.quantity);

    if (!item.productId) {
      errors.productId = "Product is required";
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      errors.quantity = "Quantity at 1 or more required";
    }
  });

  // Transaction section

  if (!performedBy || performedBy === "") {
    errors.performedBy = "Performed by is required";
  }

  if (!paymentMethod || paymentMethod === "") {
    errors.paymentMethod = "Payment method is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      performedBy,
      paymentMethod,
      note,
      items: items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      })),
    },
  };
}
