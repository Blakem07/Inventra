import { Router } from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import StockMovement from "../models/StockMovement.js";

const router = Router();

/**
 * GET /dashboard/summary
 *
 * Returns a real-time dashboard summary computed directly from source models.
 * All metrics are calculated live without relying on cached summaries.
 *
 * Metrics included:
 * - lowStockCount: number of active products with stock > 0 and <= reorder level
 * - outOfStockCount: number of active products with stock <= 0
 * - salesCountToday: number of sales that occurred today
 * - totalSalesAmountToday: sum of total_amount for today’s sales
 * - itemsSoldToday: sum of quantities across all sale items from today’s sales
 * - recentActivity: latest stock movements, newest first (fixed window)
 */
router.get("/summary", async (req, res, next) => {
  try {
    const lowStockCount = await Product.countDocuments({
      on_hand: { $gt: 0 },
      $expr: { $lte: ["$on_hand", "$reorder_level"] },
      is_active: true,
    });

    const outOfStockCount = await Product.countDocuments({
      on_hand: { $lte: 0 },
      is_active: true,
    });

    let startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let startOfNextDay = new Date(startOfToday);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const salesCountToday = await Sale.countDocuments({
      occurred_at: {
        $gte: startOfToday,
        $lt: startOfNextDay,
      },
    });

    const totalSalesAmountTodayAgg = await Sale.aggregate([
      {
        $match: {
          occurred_at: {
            $gte: startOfToday,
            $lt: startOfNextDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSalesAmountToday: { $sum: "$total_amount" },
        },
      },
    ]);
    const totalSalesAmountToday = totalSalesAmountTodayAgg[0]?.totalSalesAmountToday ?? 0;

    const itemsSoldTodayAgg = await Sale.aggregate([
      {
        $match: {
          occurred_at: {
            $gte: startOfToday,
            $lt: startOfNextDay,
          },
        },
      },
      {
        $lookup: {
          from: "saleitems",
          localField: "_id",
          foreignField: "sale_id",
          as: "items",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          itemsSoldToday: { $sum: "$items.quantity" },
        },
      },
    ]);

    const itemsSoldToday = itemsSoldTodayAgg[0]?.itemsSoldToday ?? 0;

    const recentActivity = await StockMovement.find().sort({ createdAt: -1 }).limit(15);

    return res.status(200).json({
      lowStockCount,
      outOfStockCount,
      salesCountToday,
      totalSalesAmountToday,
      itemsSoldToday,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
