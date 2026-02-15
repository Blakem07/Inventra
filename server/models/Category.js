import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Category represents a product grouping used for filtering
 * and classification in inventory.
 */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
