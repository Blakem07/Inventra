import { Router } from "express";
import { StockService } from "../services/stockService.js";
import { validateBody } from "../middlewares/validate.js";
import { validateStockMovement } from "../validators/stockValidators.js";

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

export default router;
