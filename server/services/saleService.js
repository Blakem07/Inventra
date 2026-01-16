import mongoose from "mongoose";
import { StockService } from "./stockService.js";

/**
 * SaleService records sales and applies stock changes atomically.
 *
 * Boundary:
 * - SaleService coordinates the use case.
 * - StockService is the only code allowed to mutate Product.on_hand and write StockMovement rows.
 */
export class SaleService {
  /**
   * Records a sale and applies stock OUT movements.
   *
   * @param {Object} input
   * @param {Date=} input.occurred_at
   * @param {"Cash"|"GCash"|"Other"} input.payment_method
   * @param {string} input.performed_by
   * @param {string=} input.note
   * @param {{product_id:string, quantity:number}[]} input.items
   * @returns {Promise<{sale_id: string, total_amount: number}>}
   */
  static async recordSale(input) {
    const Product = mongoose.model("Product");
    const Sale = mongoose.model("Sale");
    const SaleItem = mongoose.model("SaleItem");

    if (!Array.isArray(input.items) || input.items.length === 0) {
      const err = new Error("Sale must include at least one item");
      err.status = 400;
      throw err;
    }

    const occurredAt = input.occurred_at ?? new Date();

    const session = await mongoose.startSession();
    try {
      const result = await session.withTransaction(async () => {
        // Fetch products for pricing + active check
        const ids = input.items.map((i) => i.product_id);
        const products = await Product.find({
          _id: { $in: ids },
          is_active: true,
        }).session(session);

        const byId = new Map(products.map((p) => [String(p._id), p]));

        // Validate items
        for (const item of input.items) {
          if (!byId.has(String(item.product_id))) {
            const err = new Error("Product not found or inactive");
            err.status = 404;
            throw err;
          }
          if (!Number.isFinite(item.quantity) || item.quantity < 1) {
            const err = new Error("Quantity must be >= 1");
            err.status = 400;
            throw err;
          }
        }

        // Create sale shell (total updated after line totals computed)
        const [sale] = await Sale.create(
          [
            {
              occurred_at: occurredAt,
              payment_method: input.payment_method,
              total_amount: 0,
              note: input.note,
              performed_by: input.performed_by,
            },
          ],
          { session }
        );

        // Build SaleItems; apply stock via StockService (only mutator)
        const saleItems = [];
        let total = 0;

        for (const item of input.items) {
          const product = byId.get(String(item.product_id));
          const unit_price = product.price;
          const line_total = unit_price * item.quantity;
          total += line_total;

          saleItems.push({
            sale_id: sale._id,
            product_id: product._id,
            quantity: item.quantity,
            unit_price,
            line_total,
          });

          await StockService.applyOut({
            session,
            product_id: product._id,
            quantity: item.quantity,
            occurred_at: occurredAt,
            performed_by: input.performed_by,
            sale_id: sale._id,
            reason: "SALE",
            note: input.note,
          });
        }

        await SaleItem.insertMany(saleItems, { session });

        await Sale.updateOne({ _id: sale._id }, { $set: { total_amount: total } }, { session });

        return { sale_id: String(sale._id), total_amount: total };
      });

      return result;
    } finally {
      session.endSession();
    }
  }
}
