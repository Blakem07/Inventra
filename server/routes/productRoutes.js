import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

// Defines a whitelist of fields the endpoint will accept
const ALLOWED_CLIENT_KEYS = ["name", "skuOrBarcode", "categoryId", "unit", "price", "reorderLevel"];

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

    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID category provided is invalid." } });
    }

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

/**
 * GET /products/:id
 *
 * Read-only single product lookup by id.
 *
 * Validates ObjectId format.
 * Returns 400 for invalid id, 404 if not found.
 *
 * Computes a transient `status` field (OUT | LOW | OK)
 * based on on_hand and reorder_level.
 *
 * Does not persist or filter by status.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID provided is invalid." } });
    }

    const result = await Product.findById(id).lean();

    if (result === null) {
      res.status(404).json({
        error: { status: 404, message: "A product with the the given ID was NOT found." },
      });
      return;
    }

    if (result.on_hand === 0) {
      result.status = "OUT";
    } else if (result.on_hand > 0 && result.on_hand <= result.reorder_level) {
      result.status = "LOW";
    } else {
      result.status = "OK";
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * Updates product metadata by ID.
 *
 * This endpoint performs a partial update on a product document while enforcing
 * a strict update contract. Only explicitly allowed metadata fields may be modified.
 *
 * Guarantees:
 * - Inventory state (`on_hand`) cannot be modified.
 * - Unknown request body keys are rejected.
 * - Category updates must reference a valid ObjectId.
 * - Empty update payloads are rejected.
 * - Updates are applied using `$set` to prevent document replacement.
 *
 * Responses:
 * - 200: Product updated successfully.
 * - 400: Invalid ID, invalid payload, forbidden field, or no updatable fields.
 * - 404: Product not found.
 *
 * Route: PUT /products/:id
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoryId = req.body.categoryId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID provided is invalid." } });
    }

    if ("categoryId" in req.body && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The new category ID provided is invalid." } });
    }

    if ("on_hand" in req.body || "onHand" in req.body) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "On hand modifications not allowed." } });
    }

    if (hasOnlyAllowedKeys(req.body) === false) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "Unknown key found within the request body." } });
    }

    const update = buildProductUpdate(req.body);

    if (isEmpty(update) === true) {
      return res.status(400).json({
        error: { status: 400, message: "No updatable fields were provided." },
      });
    }

    const updatedResult = await Product.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    );

    if (updatedResult === null) {
      res.status(404).json({
        error: { status: 404, message: "A product with the the given ID was NOT found." },
      });
      return;
    }

    res.status(200).json(updatedResult);
  } catch (err) {
    next(err);
  }
});

/**
 * Checks whether a request body contains only keys explicitly allowed
 * by the product update endpoint contract.
 *
 * The presence of any key outside the allowlist indicates a client error
 * and must result in request rejection.
 *
 * @param {Object} reqBody - Raw request body to validate.
 * @returns {boolean} True if all keys are allowed; false if any unknown key is found.
 */
function hasOnlyAllowedKeys(reqBody) {
  for (const key of Object.keys(reqBody)) {
    if (!ALLOWED_CLIENT_KEYS.includes(key)) {
      return false;
    }
  }

  return true;
}

/**
 * Determines whether an object has no own enumerable properties.
 *
 * Used to detect update payloads that contain no valid field changes
 * and should therefore be rejected as invalid requests.
 *
 * @param {Object} obj - Object to check for own properties.
 * @returns {boolean} True if the object is empty; false otherwise.
 */
function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

/**
 * Builds a sanitized product update payload by whitelisting allowed fields
 * from a request body and converting their keys from camelCase to snake_case.
 *
 * Undefined values are excluded.
 *
 * @param {Object} reqBody - Raw request body containing product fields.
 * @returns {Object} update - Filtered and transformed update object ready for persistence.
 */
function buildProductUpdate(reqBody) {
  const update = {};

  for (const key of ALLOWED_CLIENT_KEYS) {
    if (key in reqBody && reqBody[key] !== undefined) {
      update[translateKey(key)] = reqBody[key];
    }
  }

  return update;
}

/**
 * Translates a camelCase or PascalCase string into snake_case.
 *
 * Handles transitions from:
 * - lowercase or digit to uppercase
 * - consecutive uppercase followed by lowercase
 *
 * @param {string} keyStr - Input key in camelCase or PascalCase.
 * @returns {string} Transformed key in snake_case.
 */
function translateKey(keyStr) {
  return keyStr
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

/**
 * Archives a product by ID.
 *
 * This endpoint performs a lifecycle state change only. It marks a product
 * as inactive by setting `is_active` to false.
 *
 * Guarantees:
 * - No request body is accepted.
 * - No product metadata or inventory state is modified.
 * - Operation is idempotent.
 *
 * Responses:
 * - 200: Product archived successfully.
 * - 400: Invalid ID or non-empty request body.
 * - 404: Product not found.
 *
 * Route: PATCH /products/:id/archive
 */
router.patch("/:id/archive", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "The ID provided is invalid." } });
    }

    if (Object.keys(req.body).length > 0) {
      return res
        .status(400)
        .json({ error: { status: 400, message: "Request body must be empty." } });
    }

    const updatedResult = await Product.findByIdAndUpdate(
      id,
      { $set: { is_active: false } },
      {
        new: true,
      },
    );

    if (updatedResult === null) {
      res.status(404).json({
        error: { status: 404, message: "A product with the the given ID was NOT found." },
      });
      return;
    }

    res.status(200).json(updatedResult);
  } catch (err) {
    next(err);
  }
});

export default router;
