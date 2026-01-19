import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = Router();

/**
 * GET /products
 *
 * Read-only inventory listing.
 *
 * Supports optional query parameters:
 * - search: matches name (case-insensitive regex) OR exact sku_or_barcode
 * - categoryId: filters by category_id
 * - activeOnly: defaults to true; when "false", includes inactive products
 *
 * Computes a transient `status` field per product:
 * - OUT | LOW | OK
 *
 * Does not persist or filter by status.
 */
router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;
    const categoryId = req.query.categoryId;
    const activeOnly = req.query.activeOnly;

    const filter = {};

    if (search) {
      filter["$or"] = [{ name: { $regex: search, $options: "i" } }, { sku_or_barcode: search }];
    }

    if (categoryId) {
      filter["category_id"] = new mongoose.Types.ObjectId(req.query.categoryId);
    }

    filter["is_active"] = true;
    if (activeOnly == "false") delete filter["is_active"];

    const result = await Product.find(filter).lean();

    result.forEach((item) => {
      if (item.on_hand === 0) {
        item.status = "OUT";
      } else if (item.on_hand > 0 && item.on_hand <= item.reorder_level) {
        item.status = "LOW";
      } else {
        item.status = "OK";
      }
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
