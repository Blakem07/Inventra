import { Router } from "express";
import Category from "../models/Category.js";

import { formatCategory } from "./categoryFormatter.js";

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
    res.status(200).json(result.map(formatCategory));
  } catch (err) {
    next(err);
  }
});

/**
 * POST /categories
 *
 * Creates a new category.
 *
 * Returns the newly created category document.
 */
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await Category.create({ name });

    res.status(201).json(formatCategory(newCategory));
  } catch (err) {
    next(err);
  }
});

export default router;
