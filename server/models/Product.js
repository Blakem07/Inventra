import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Product represents an inventory item.
 *
 * This model holds the current stock state (`on_hand`) as a cached value
 * to support fast reads and safe concurrency checks.
 *
 * IMPORTANT INVARIANT:
 * - `on_hand` must only change as the result of a stock event
 *   (sale, stock-in, adjustment).
 * - Every change to `on_hand` must have a corresponding
 *   `stock_movement` record.
 *
 * `stock_movements` is the audit history.
 * `on_hand` is the current truth.
 */
const productSchema = new Schema(
  {
    /**
     * Human-readable product name shown in inventory lists.
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * SKU or barcode identifier.
     * Enforced as unique when present.
     */
    sku_or_barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    /**
     * Reference to product category.
     * Used for inventory filtering and reports.
     */
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    /**
     * Unit of measurement (e.g. pcs, kg, box).
     */
    unit: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Selling price per unit.
     */
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Threshold for LOW stock status.
     */
    reorder_level: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Soft delete flag.
     * Archived products remain in reports but are hidden from active lists.
     */
    is_active: {
      type: Boolean,
      default: true,
    },

    /**
     * Current quantity on hand.
     *
     * This is derived state.
     * Never modify directly from routes.
     * Always update atomically with a stock movement.
     */
    on_hand: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    /**
     * Automatically manages created_at and updated_at timestamps.
     */
    timestamps: true,
  }
);

/**
 * Indexes aligned with inventory filtering and reporting queries.
 */
productSchema.index({ category_id: 1 });
productSchema.index({ is_active: 1 });
productSchema.index({ on_hand: 1 });

export default mongoose.model("Product", productSchema);
