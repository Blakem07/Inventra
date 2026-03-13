import { Router } from "express";
import Product from "../models/Product.js";
import DailySummary from "../models/DailySummary.js";
import StockMovement from "../models/StockMovement.js";
import { toBusinessDayKey } from "../utils/dayBucket.js";
import { BUSINESS_TIMEZONE } from "../config/appConfig.js";
import { formatDashboardSummary } from "./dashboardFormatter.js";

const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const now = new Date();
    const summary_date = toBusinessDayKey(now, BUSINESS_TIMEZONE);

    const summary = await DailySummary.findOne({
      summary_date,
    }).lean();

    const low_stock_count = await Product.countDocuments({
      is_active: true,
      on_hand: { $gt: 0 },
      $expr: { $lte: ["$on_hand", "$reorder_level"] },
    });

    const out_of_stock_count = await Product.countDocuments({
      is_active: true,
      on_hand: 0,
    });

    const recent_activity_raw = await StockMovement.find()
      .populate("product_id", "name")
      .sort({ occurred_at: -1, createdAt: -1 })
      .limit(15)
      .lean();

    const recent_activity = recent_activity_raw.map((item) => ({
      _id: item._id,
      occurred_at: item.occurred_at,
      movement_type: item.movement_type,
      quantity_change: item.quantity_change,
      sale_id: item.sale_id,
      performed_by: item.performed_by,
      reason: item.reason,
      note: item.note,
      product: item.product_id
        ? {
            _id: item.product_id._id,
            name: item.product_id.name,
          }
        : null,
    }));

    const payload = {
      summary_date,
      summary,
      low_stock_count,
      out_of_stock_count,
      recent_activity,
    };

    res.status(200).json(formatDashboardSummary(payload));
  } catch (err) {
    next(err);
  }
});

export default router;
