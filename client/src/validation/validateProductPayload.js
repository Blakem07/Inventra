/**
 * Validates and normalizes product input.
 *
 * @param {Object} values
 * @param {string} [values.name]
 * @param {string} [values.categoryId]
 * @param {string} [values.skuOrBarcode]
 * @param {string} [values.unit]
 * @param {string|number} [values.price]
 * @param {string|number} [values.reorderLevel]
 *
 * @returns {{
 *   errors?: Object.<string, string>,
 *   data?: {
 *     name: string,
 *     categoryId: string,
 *     skuOrBarcode?: string,
 *     unit: string,
 *     price: number,
 *     reorderLevel: number
 *   }
 * }}
 */
export default function validateProductPayload(values) {
  const errors = {};

  const name = values.name?.trim();
  const categoryId = values.categoryId?.trim();
  const skuOrBarcode = values.skuOrBarcode?.trim();
  const unit = values.unit?.trim().toLowerCase();
  const price = Number(values.price);
  const reorderLevel = Number(values.reorderLevel);

  if (!name) {
    errors.name = "Name is required";
  }

  if (!categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!unit) {
    errors.unit = "Unit is required";
  }

  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be 0 or more if provided";
  }

  if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
    errors.reorderLevel = "Reorder level must be 0 or more if provided";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: {
      name,
      categoryId,
      skuOrBarcode,
      unit,
      price,
      reorderLevel,
    },
  };
}
