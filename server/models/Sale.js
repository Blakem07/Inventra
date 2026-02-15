import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Sale represents a completed transaction.
 * Stock effects are handled via StockMovement, not here.
 */
const saleSchema = new Schema(
  {
    /**
     * Business time when the sale occurred.
     */
    occurred_at: {
      type: Date,
      required: true,
    },

    /**
     * Payment method used for the sale.
     */
    payment_method: {
      type: String,
      enum: ["Cash", "GCash", "Other"],
      required: true,
    },

    /**
     * Computed total amount for the sale.
     * Must equal the sum of sale_items.line_total.
     */
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Optional note attached to the sale.
     */
    note: {
      type: String,
      trim: true,
    },

    /**
     * Actor who recorded the sale.
     */
    performed_by: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Sale", saleSchema);
