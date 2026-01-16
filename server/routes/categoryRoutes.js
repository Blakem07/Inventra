import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await Category.find();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
