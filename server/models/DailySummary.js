import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * DailySummary stores total sales numbers for each business day.
 *
 * SIMPLE RULES:
 * - One document = one business day.
 * - When a sale happens, its exact time (`occurred_at`) is saved in UTC.
 *   UTC is just a universal reference clock used for consistency.
 *
 * - To decide which "day" a sale belongs to, we DO NOT use UTC.
 *   We use the business’s own local timezone (for example: Asia/Manila).
 *
 * Why this matters:
 * - If UTC is used, a sale just after midnight locally
 *   could be counted as the previous day.
 * - That would make daily totals wrong on dashboards.
 *
 * How to determine the day:
 * 1. Take the sale time (`occurred_at`).
 * 2. Convert it to the business’s local timezone.
 * 3. Extract the calendar date (YYYY-MM-DD).
 * 4. Store that as `summary_date`.
 *
 * Important:
 * - Always use the same BUSINESS_TIMEZONE everywhere.
 * - Never use server timezone.
 * - Never bucket by UTC midnight. Bucket by the business timezone calendar date.
 *
 * Totals are calculated from sales and must never be edited manually.
 */
const dailySummarySchema = new Schema(
  {
    summary_date: {
      type: String, // "YYYY-MM-DD" in business timezone
      required: true, // Required to uniquely identify the business day
      unique: true, // Enforces one summary document per day
    },

    /**
     * Total number of completed sales for that day
     */
    total_sales_count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    /**
     * Sum of item quantities sold that day
     */
    total_items_sold: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    /**
     * Aggregate monetary value of all sales for the day
     */
    total_sales_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("DailySummary", dailySummarySchema);
