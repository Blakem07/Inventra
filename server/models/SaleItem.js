import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * SaleItem represents a single product line in a sale.
 * It is immutable once created.
 */
const saleItemSchema = new Schema(
  {
    /**
     * Parent sale.
     */
    sale_id: {
      type: Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },

    /**
     * Product sold.
     */
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    /**
     * Quantity sold.
     */
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    /**
     * Unit price at time of sale.
     */
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * quantity * unit_price.
     * Stored for audit and reporting.
     */
    line_total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for sales and product reporting.
 */
saleItemSchema.index({ sale_id: 1 });
saleItemSchema.index({ product_id: 1 });

export default mongoose.model("SaleItem", saleItemSchema);
