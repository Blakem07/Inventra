import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * StockMovement represents an immutable stock event.
 *
 * Each record explains why and when stock changed.
 * These records must never be edited or deleted.
 */
const stockMovementSchema = new Schema(
  {
    /**
     * When the stock event occurred (business time).
     */
    occurred_at: {
      type: Date,
      required: true,
    },

    /**
     * Product affected by this movement.
     */
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    /**
     * Type of stock change.
     */
    movement_type: {
      type: String,
      enum: ["IN", "OUT", "ADJUST"],
      required: true,
    },

    /**
     * Signed delta applied to product.on_hand.
     * Positive = stock in, negative = stock out.
     */
    quantity_change: {
      type: Number,
      required: true,
    },

    /**
     * Linked sale, if this movement was caused by a sale.
     */
    sale_id: {
      type: Schema.Types.ObjectId,
      ref: "Sale",
    },

    /**
     * Actor who performed the action.
     */
    performed_by: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Reason for adjustment (manual, correction, etc.).
     */
    reason: {
      type: String,
      trim: true,
    },

    /**
     * Optional free-form note.
     */
    note: {
      type: String,
      trim: true,
    },
  },
  {
    /**
     * createdAt is audit metadata, not business time.
     */
    timestamps: true,
  }
);

/**
 * Indexes for reporting and history queries.
 */
stockMovementSchema.index({ occurred_at: 1 });
stockMovementSchema.index({ product_id: 1 });

export default mongoose.model("StockMovement", stockMovementSchema);
