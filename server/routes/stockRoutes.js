import { Router } from "express";
import { StockService } from "../services/stockService.js";

const router = Router();

router.post("/movements", async (req, res, next) => {
  try {
    const movement = await StockService.createMovement(req.body);
    res.status(201).json(movement);
  } catch (err) {
    next(err);
  }
});

export default router;
