export function formatProduct(product) {
  const p = typeof product?.toObject === "function" ? product.toObject() : product;

  return {
    id: String(p._id),
    name: p.name,
    categoryId: String(p.category_id),
    skuOrBarcode: p.sku_or_barcode ?? null,
    unit: p.unit,
    price: p.price,
    reorderLevel: p.reorder_level ?? 0,
    onHand: p.on_hand,
    isActive: p.is_active,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
