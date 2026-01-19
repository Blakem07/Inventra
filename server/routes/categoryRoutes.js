import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

/**
 * GET /categories
 *
 * Read-only category listing.
 *
 * Returns all categories with no filtering or derived fields.
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await Category.find();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
