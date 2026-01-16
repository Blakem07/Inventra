import { Router } from "express";
import { SaleService } from "../services/saleService.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const result = await SaleService.recordSale(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
