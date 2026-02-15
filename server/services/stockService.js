import mongoose from "mongoose";

/**
 * StockService owns all inventory mutations.
 *
 * Invariants:
 * - products.on_hand changes only inside this service.
 * - Every change writes a StockMovement record.
 * - Stock never goes below zero.
 */
export class StockService {
  /**
   * Creates a manual stock movement (IN/OUT/ADJUST) and updates product.on_hand atomically.
   *
   * @param {Object} input
   * @param {string} input.product_id
   * @param {"IN"|"OUT"|"ADJUST"} input.movement_type
   * @param {number} input.quantity
   * @param {Date} input.occurred_at
   * @param {string} input.performed_by
   * @param {string=} input.reason
   * @param {string=} input.note
   * @returns {Promise<Object>} created StockMovement
   */
  static async createMovement(input) {
    const Product = mongoose.model("Product");
    const StockMovement = mongoose.model("StockMovement");

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const product = await Product.findById(input.product_id).session(session);
        if (!product) {
          const err = new Error("Product not found");
          err.status = 404;
          throw err;
        }

        if (input.quantity <= 0 || !Number.isFinite(input.quantity)) {
          const err = new Error("Quantity must be > 0");
          err.status = 400;
          throw err;
        }

        let quantity_change = 0;

        if (input.movement_type === "IN") {
          quantity_change = +input.quantity;

          await Product.updateOne(
            { _id: product._id },
            { $inc: { on_hand: quantity_change } },
            { session }
          );
        }

        if (input.movement_type === "OUT") {
          quantity_change = -input.quantity;

          const update = await Product.updateOne(
            { _id: product._id, on_hand: { $gte: input.quantity } },
            { $inc: { on_hand: quantity_change } },
            { session }
          );

          if (update.matchedCount === 0) {
            const err = new Error("Insufficient stock");
            err.status = 422;
            throw err;
          }
        }

        if (input.movement_type === "ADJUST") {
          const newOnHand = input.quantity;
          if (newOnHand < 0) {
            const err = new Error("on_hand cannot be negative");
            err.status = 400;
            throw err;
          }

          quantity_change = newOnHand - product.on_hand;

          await Product.updateOne(
            { _id: product._id },
            { $set: { on_hand: newOnHand } },
            { session }
          );
        }

        const [movement] = await StockMovement.create(
          [
            {
              occurred_at: input.occurred_at ?? new Date(),
              product_id: product._id,
              movement_type: input.movement_type,
              quantity_change,
              performed_by: input.performed_by,
              reason: input.reason,
              note: input.note,
            },
          ],
          { session }
        );

        return movement;
      });

      return result;
    } finally {
      session.endSession();
    }
  }

  /**
   * Applies a stock OUT change inside an existing transaction session.
   * Used by SaleService so Product.on_hand is only mutated here.
   *
   * @param {Object} input
   * @param {import("mongoose").ClientSession} input.session
   * @param {string|import("mongoose").Types.ObjectId} input.product_id
   * @param {number} input.quantity
   * @param {Date} input.occurred_at
   * @param {string} input.performed_by
   * @param {string|import("mongoose").Types.ObjectId=} input.sale_id
   * @param {string=} input.reason
   * @param {string=} input.note
   * @returns {Promise<void>}
   */
  static async applyOut(input) {
    const Product = mongoose.model("Product");
    const StockMovement = mongoose.model("StockMovement");

    if (!input.session) {
      const err = new Error("Transaction session is required");
      err.status = 500;
      throw err;
    }

    if (!Number.isFinite(input.quantity) || input.quantity < 1) {
      const err = new Error("Quantity must be >= 1");
      err.status = 400;
      throw err;
    }

    // Conditional decrement prevents negative stock under concurrency
    const update = await Product.updateOne(
      { _id: input.product_id, on_hand: { $gte: input.quantity } },
      { $inc: { on_hand: -input.quantity } },
      { session: input.session }
    );

    if (update.matchedCount === 0) {
      const err = new Error("Insufficient stock");
      err.status = 422;
      throw err;
    }

    await StockMovement.create(
      [
        {
          occurred_at: input.occurred_at ?? new Date(),
          product_id: input.product_id,
          movement_type: "OUT",
          quantity_change: -input.quantity,
          sale_id: input.sale_id,
          performed_by: input.performed_by,
          reason: input.reason ?? "SALE",
          note: input.note,
        },
      ],
      { session: input.session }
    );
  }
}
