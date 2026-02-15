import { Router } from "express";
import { StockService } from "../services/stockService.js";
import { validateBody } from "../middlewares/validate.js";
import { validateStockMovement } from "../validators/stockValidators.js";
import mongoose from "mongoose";
import StockMovement from "../models/StockMovement.js";
import { buildCreatedAtRange } from "../helpers/index.js";

const router = Router();

/**
 * POST /stock/movements
 *
 * Records a stock movement event.
 *
 * Validates request body and delegates inventory
 * mutation logic to the StockService.
 */
router.post("/movements", validateBody(validateStockMovement), async (req, res, next) => {
  try {
    const movement = await StockService.createMovement(req.body);
    res.status(201).json(movement);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /movements
 *
 * Returns a read-only list of stock movements, optionally filtered by an
 * inclusive createdAt date range using `from` and/or `to` query parameters.
 *
 * Query parameters:
 * - productId (optional): MongoDB ObjectId to filter by product
 * - from (optional): ISO date string lower bound
 * - to (optional): ISO date string upper bound
 *
 * Behavior:
 * - Validates productId format when provided
 * - Validates date format and range ordering
 * - Sorts results by newest first
 * - Returns 200 with an array (empty if no matches)
 * - Returns 400 on invalid query input
 */
router.get("/movements", async (req, res, next) => {
  try {
    const productId = req.query.productId;
    const from = req.query.from;
    const to = req.query.to;

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The product id provided is invalid." } });
    }

    const filter = {};

    if (from != undefined || to != undefined) {
      const built = buildCreatedAtRange({ from, to });

      if (built.error) {
        return res
          .status(built.error.status)
          .json({ error: { status: built.error.status, message: built.error.message } });
      } else if (built.range) {
        filter["createdAt"] = built.range;
      }
    }

    if (productId) {
      filter["product_id"] = new mongoose.Types.ObjectId(req.query.productId);
    }

    const result = await StockMovement.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
