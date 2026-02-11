import { Router } from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import StockMovement from "../models/StockMovement.js";
import { buildCreatedAtRange } from "../helpers/index.js";
import mongoose from "mongoose";

const router = Router();

/**
 * GET reports/stock-levels
 *
 * Returns current stock levels for products with optional filtering.
 * Stock status is derived per product based on on-hand quantity
 * relative to its reorder level.
 *
 * Filters:
 * - categoryId: limit results to a specific product category
 * - activeOnly: include inactive products when set to "false"
 *
 * Status rules:
 * - OUT: on_hand <= 0
 * - LOW: on_hand > 0 and <= reorder_level
 * - OK: on_hand > reorder_level
 */
router.get("/stock-levels", async (req, res, next) => {
  try {
    const categoryId = req.query.categoryId;
    const activeOnly = req.query.activeOnly;

    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID category provided is invalid." } });
    }

    const filter = {};

    if (categoryId) {
      filter["category_id"] = new mongoose.Types.ObjectId(req.query.categoryId);
    }

    filter["is_active"] = true;
    if (activeOnly == "false") delete filter["is_active"];

    const result = await Product.find(filter).lean();

    const mappedResult = result.map((p) => {
      let status = null;
      if (p.on_hand <= 0) {
        status = "OUT";
      } else if (p.on_hand > 0 && p.on_hand <= p.reorder_level) {
        status = "LOW";
      } else {
        status = "OK";
      }

      return {
        productId: p._id,
        name: p.name,
        sku: p.sku_or_barcode,
        categoryId: p.category_id,
        reorderLevel: p.reorder_level,
        onHand: p.on_hand,
        isActive: p.is_active,
        status: status,
      };
    });

    res.status(200).json({ data: mappedResult, meta: { count: mappedResult.length } });
  } catch (err) {
    next(err);
  }
});

/**
 * GET routes/sales
 *
 * Returns sales that occurred within a required date range.
 * Date inputs are validated and converted into an occurred_at range filter.
 *
 * Query parameters:
 * - from: range start (required)
 * - to: range end (required)
 *
 * Output includes:
 * - data: list of sales (id, occurredAt, paymentMethod, totalAmount, performedBy)
 * - totals:
 *   - count: number of matched sales
 *   - gross: sum of total_amount across matched sales
 * - meta: echoes the requested from and to values
 */
router.get("/sales", async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;

    const filter = {};

    if (from != undefined && to != undefined) {
      const built = buildCreatedAtRange({ from, to });

      if (built.error) {
        return res
          .status(built.error.status)
          .json({ error: { status: built.error.status, message: built.error.message } });
      } else if (built.range) {
        filter["occurred_at"] = built.range;
      }
    } else {
      return res
        .status(400)
        .json({ error: { status: 400, message: "Missing from & to query parameters" } });
    }

    const result = await Sale.find(filter).lean();

    let grossSum = 0;
    result.forEach((s) => {
      grossSum += s.total_amount;
    });

    const mappedResult = result.map((s) => {
      return {
        saleId: s._id,
        occurredAt: s.occurred_at,
        paymentMethod: s.payment_method,
        totalAmount: s.total_amount,
        performedBy: s.performed_by,
      };
    });

    res.status(200).json({
      data: mappedResult,
      totals: { count: result.length, gross: grossSum },
      meta: { from: from, to: to },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /reports/movements
 *
 * Returns a read-only stock movement report for a given date range,
 * optionally filtered by productId.
 *
 * - Enforces mandatory `from` and `to` query parameters.
 * - Validates optional `productId` as a valid ObjectId.
 * - Filters by business time (`occurred_at`), not audit timestamps.
 * - Sorts movements by occurred_at descending.
 * - Populates product_id to include product name in the report output.
 * - Returns report-shaped response with:
 *     data  -> movement rows
 *     meta  -> report context (from, to, count)
 *
 * Each row represents one immutable stock movement event.
 */
router.get("/movements", async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    const productId = req.query.productId;

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID product provided is invalid." } });
    }

    const filter = {};

    if (productId) {
      filter["product_id"] = new mongoose.Types.ObjectId(req.query.productId);
    }

    if (from != undefined && to != undefined) {
      const built = buildCreatedAtRange({ from, to });

      if (built.error) {
        return res
          .status(built.error.status)
          .json({ error: { status: built.error.status, message: built.error.message } });
      } else if (built.range) {
        filter["occurred_at"] = built.range;
      }
    } else {
      return res
        .status(400)
        .json({ error: { status: 400, message: "Missing from & to query parameters" } });
    }

    const result = await StockMovement.find(filter)
      .populate("product_id")
      .sort({ occurred_at: -1 })
      .lean();

    const resultMapped = result.map((m) => {
      return {
        movementId: m._id,
        occurredAt: m.occurred_at,
        type: m.movement_type,
        quantity: m.quantity_change,
        reason: m.reason,
        product: { productId: m.product_id._id, name: m.product_id.name },
        performedBy: m.performed_by,
      };
    });

    res.status(200).json({
      data: resultMapped,
      meta: { from: from, to: to, count: result.length },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
