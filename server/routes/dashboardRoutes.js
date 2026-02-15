import { Router } from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import DailySummary from "../models/DailySummary.js";
import StockMovement from "../models/StockMovement.js";
import { toBusinessDayKey } from "../utils/dayBucket.js";
import { BUSINESS_TIMEZONE } from "../config/appConfig.js";

const router = Router();

/**
 * GET /dashboard/summary
 *
 * Returns a dashboard summary using the DailySummary projection
 * for sales metrics and live inventory data for stock metrics.
 *
 * Sales totals are incrementally maintained at write-time
 * (during SaleService.recordSale) and read directly here,
 * avoiding runtime aggregation over raw sales data.
 *
 * Metrics included:
 * - summaryDate: the YYYY-MM-DD business date represented
 * - lowStockCount: number of active products with stock > 0 and <= reorder level
 * - outOfStockCount: number of active products with stock <= 0
 * - salesCountToday: total sales count for the business day (from DailySummary)
 * - totalSalesAmountToday: total sales amount for the business day (from DailySummary)
 * - itemsSoldToday: total quantity of items sold for the business day (from DailySummary)
 * - recentActivity: latest stock movements, newest first (fixed window)
 */
router.get("/summary", async (req, res, next) => {
  try {
    const now = new Date();
    const summaryDate = toBusinessDayKey(now, BUSINESS_TIMEZONE);

    const summary = await DailySummary.findOne({
      summary_date: summaryDate,
    }).lean();

    const lowStockCount = await Product.countDocuments({
      is_active: true,
      on_hand: { $gt: 0 },
      $expr: { $lte: ["$on_hand", "$reorder_level"] },
    });

    const outOfStockCount = await Product.countDocuments({
      is_active: true,
      on_hand: 0,
    });

    const recentActivity = await StockMovement.find()
      .sort({ occurred_at: -1, createdAt: -1 })
      .limit(15)
      .lean();

    res.status(200).json({
      summaryDate,
      lowStockCount,
      outOfStockCount,
      salesCountToday: summary?.total_sales_count ?? 0,
      totalSalesAmountToday: summary?.total_sales_amount ?? 0,
      itemsSoldToday: summary?.total_items_sold ?? 0,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
