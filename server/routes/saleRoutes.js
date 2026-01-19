import { Router } from "express";
import { SaleService } from "../services/saleService.js";
import { validateBody } from "../middlewares/validate.js";
import { validateSale } from "../validators/saleValidators.js";

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

export default router;
