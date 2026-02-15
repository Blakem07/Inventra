import { Router } from "express";
import { SaleService } from "../services/saleService.js";
import { validateBody } from "../middlewares/validate.js";
import { validateSale } from "../validators/saleValidators.js";
import Sale from "../models/Sale.js";
import { buildCreatedAtRange } from "../helpers/index.js";

const router = Router();

/**
 * POST /sales
 *
 * Records a sale transaction.
 *
 * Validates request body and delegates business logic
 * to the SaleService.
 */
router.post("/", validateBody(validateSale), async (req, res, next) => {
  try {
    const result = await SaleService.recordSale(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /sales
 *
 * Returns a read-only list of sales, optionally filtered by an inclusive
 * createdAt date range using `from` and/or `to` query parameters.
 *
 * Query parameters:
 * - from (optional): ISO date string lower bound
 * - to (optional): ISO date string upper bound
 *
 * Behavior:
 * - Validates date format and range ordering
 * - Sorts results by newest first
 * - Returns 200 with an array (empty if no matches)
 * - Returns 400 on invalid date input
 */
router.get("/", async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;

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

    const result = await Sale.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
