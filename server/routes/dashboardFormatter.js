export function formatDashboardSummary(data) {
  return {
    summaryDate: data.summary_date,
    lowStockCount: data.low_stock_count,
    outOfStockCount: data.out_of_stock_count,
    salesCountToday: data.summary?.total_sales_count ?? 0,
    totalSalesAmountToday: data.summary?.total_sales_amount ?? 0,
    itemsSoldToday: data.summary?.total_items_sold ?? 0,

    recentActivity: data.recent_activity.map((item) => ({
      id: String(item._id),
      occurredAt: item.occurred_at,
      movementType: item.movement_type,
      quantityChange: item.quantity_change,
      saleId: item.sale_id ?? null,
      performedBy: item.performed_by ?? null,
      reason: item.reason ?? null,
      note: item.note ?? null,

      product: item.product
        ? {
            id: String(item.product._id),
            name: item.product.name,
          }
        : null,
    })),
  };
}
