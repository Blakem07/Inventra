import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Seeds a demo MongoDB database with a complete baseline dataset:
// - Connects using env-configured URI
// - Clears existing collections (Category, Product, Sale, SaleItem, StockMovement)
// - Inserts sample categories and products
// - Initializes stock via IN and ADJUST movements
// - Creates sample sales with corresponding sale items
// - Mirrors each sale with OUT stock movements to maintain inventory consistency

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import SaleItem from "../models/SaleItem.js";
import StockMovement from "../models/StockMovement.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEMO_DB_URI =
  process.env.DEMO_MONGODB_URI ||
  process.env.MONGODB_DEMO_URI ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

if (!DEMO_DB_URI) {
  throw new Error(
    "Missing MongoDB URI. Set DEMO_MONGODB_URI, MONGODB_DEMO_URI, MONGO_URI, or MONGODB_URI in server/.env",
  );
}

const SYSTEM_USER = "demo-seed";

/**
 * Builds recent demo timestamps using UTC.
 *
 * This keeps seed data visible in dashboard and report filters without tying
 * the seed script to the developer's local timezone or a future business timezone.
 *
 * MongoDB stores Date values as UTC instants, so this produces predictable
 * timestamps that sort correctly against records created live with new Date().
 *
 * @param {number} daysAgo - How many calendar days before today.
 *   0 means today, 1 means yesterday, 6 means six days ago.
 * @param {number} hours - UTC hour for the generated timestamp.
 * @param {number} minutes - UTC minute for the generated timestamp.
 * @returns {Date}
 */
function buildRecentDate(daysAgo, hours = 10, minutes = 0) {
  const date = new Date();

  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(hours, minutes, 0, 0);

  return date;
}

async function connect() {
  await mongoose.connect(DEMO_DB_URI);
  console.log(`Connected to demo database: ${DEMO_DB_URI}`);
}

async function clearCollections() {
  await SaleItem.deleteMany({});
  await StockMovement.deleteMany({});
  await Sale.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  console.log("Cleared demo collections");
}

async function seedBaseline() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Spread demo activity across recent days so report filters show useful data:
      // - stock load: six days ago
      // - adjustments: five days ago
      // - sales: two days ago, yesterday, and today
      const initialStockDate = buildRecentDate(6, 8, 0);
      const adjustmentDate1 = buildRecentDate(5, 9, 15);
      const adjustmentDate2 = buildRecentDate(5, 9, 20);
      const adjustmentDate3 = buildRecentDate(5, 9, 25);
      const adjustmentDate4 = buildRecentDate(5, 9, 30);
      const saleDate1 = buildRecentDate(2, 10, 5);
      const saleDate2 = buildRecentDate(1, 18, 40);
      const saleDate3 = buildRecentDate(0, 7, 55);

      const categories = await Category.insertMany(
        [
          { name: "Beverages" },
          { name: "Canned Goods" },
          { name: "Snacks" },
          { name: "Household" },
        ],
        { session },
      );

      const [beverages, cannedGoods, snacks, household] = categories;

      const products = await Product.insertMany(
        [
          {
            name: "Coca-Cola Mismo 290ml",
            sku_or_barcode: "DEMO-COKE-290",
            category_id: beverages._id,
            unit: "pcs",
            price: 18,
            reorder_level: 12,
            is_active: true,
            on_hand: 58,
          },
          {
            name: "Lucky Me Pancit Canton Original",
            sku_or_barcode: "DEMO-PANCIT-ORI",
            category_id: snacks._id,
            unit: "pcs",
            price: 15,
            reorder_level: 15,
            is_active: true,
            on_hand: 77,
          },
          {
            name: "555 Sardines Tomato Sauce 155g",
            sku_or_barcode: "DEMO-555-SARDINES",
            category_id: cannedGoods._id,
            unit: "pcs",
            price: 30,
            reorder_level: 10,
            is_active: true,
            on_hand: 34,
          },
          {
            name: "Safeguard Soap White 135g",
            sku_or_barcode: "DEMO-SAFEGUARD-135",
            category_id: household._id,
            unit: "pcs",
            price: 42,
            reorder_level: 8,
            is_active: true,
            on_hand: 22,
          },
          {
            name: "Nescafe Classic Sachet 2g",
            sku_or_barcode: "DEMO-NESCAFE-2G",
            category_id: beverages._id,
            unit: "pcs",
            price: 3,
            reorder_level: 30,
            is_active: true,
            on_hand: 177,
          },
          {
            name: "Bear Brand Fortified 33g",
            sku_or_barcode: "DEMO-BEARBRAND-33",
            category_id: beverages._id,
            unit: "pcs",
            price: 16,
            reorder_level: 20,
            is_active: true,
            on_hand: 89,
          },
        ],
        { session },
      );

      const productMap = Object.fromEntries(
        products.map((product) => [product.sku_or_barcode, product]),
      );

      await StockMovement.insertMany(
        [
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-COKE-290"]._id,
            movement_type: "IN",
            quantity_change: 60,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-PANCIT-ORI"]._id,
            movement_type: "IN",
            quantity_change: 80,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-555-SARDINES"]._id,
            movement_type: "IN",
            quantity_change: 36,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-SAFEGUARD-135"]._id,
            movement_type: "IN",
            quantity_change: 24,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            movement_type: "IN",
            quantity_change: 200,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: initialStockDate,
            product_id: productMap["DEMO-BEARBRAND-33"]._id,
            movement_type: "IN",
            quantity_change: 90,
            performed_by: SYSTEM_USER,
            reason: "Initial demo stock load",
            note: "Baseline inventory seed",
          },
          {
            occurred_at: adjustmentDate1,
            product_id: productMap["DEMO-COKE-290"]._id,
            movement_type: "ADJUST",
            quantity_change: -1,
            performed_by: SYSTEM_USER,
            reason: "Damaged item",
            note: "Bottle dented",
          },
          {
            occurred_at: adjustmentDate2,
            product_id: productMap["DEMO-555-SARDINES"]._id,
            movement_type: "ADJUST",
            quantity_change: -1,
            performed_by: SYSTEM_USER,
            reason: "Damaged can",
            note: "Dent found during shelf check",
          },
          {
            occurred_at: adjustmentDate3,
            product_id: productMap["DEMO-SAFEGUARD-135"]._id,
            movement_type: "ADJUST",
            quantity_change: -1,
            performed_by: SYSTEM_USER,
            reason: "Missing item",
            note: "Count correction",
          },
          {
            occurred_at: adjustmentDate4,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            movement_type: "ADJUST",
            quantity_change: -10,
            performed_by: SYSTEM_USER,
            reason: "Opened pack for tingi",
            note: "Stock count correction",
          },
        ],
        { session },
      );

      const sales = await Sale.insertMany(
        [
          {
            occurred_at: saleDate1,
            payment_method: "Cash",
            total_amount: 66,
            note: "Morning walk-in customer",
            performed_by: SYSTEM_USER,
          },
          {
            occurred_at: saleDate2,
            payment_method: "GCash",
            total_amount: 87,
            note: "Evening neighborhood purchase",
            performed_by: SYSTEM_USER,
          },
          {
            occurred_at: saleDate3,
            payment_method: "Cash",
            total_amount: 24,
            note: "Quick breakfast items",
            performed_by: SYSTEM_USER,
          },
        ],
        { session },
      );

      const [sale1, sale2, sale3] = sales;

      await SaleItem.insertMany(
        [
          {
            sale_id: sale1._id,
            product_id: productMap["DEMO-COKE-290"]._id,
            quantity: 1,
            unit_price: 18,
            line_total: 18,
          },
          {
            sale_id: sale1._id,
            product_id: productMap["DEMO-PANCIT-ORI"]._id,
            quantity: 2,
            unit_price: 15,
            line_total: 30,
          },
          {
            sale_id: sale1._id,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            quantity: 6,
            unit_price: 3,
            line_total: 18,
          },
          {
            sale_id: sale2._id,
            product_id: productMap["DEMO-555-SARDINES"]._id,
            quantity: 1,
            unit_price: 30,
            line_total: 30,
          },
          {
            sale_id: sale2._id,
            product_id: productMap["DEMO-SAFEGUARD-135"]._id,
            quantity: 1,
            unit_price: 42,
            line_total: 42,
          },
          {
            sale_id: sale2._id,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            quantity: 5,
            unit_price: 3,
            line_total: 15,
          },
          {
            sale_id: sale3._id,
            product_id: productMap["DEMO-BEARBRAND-33"]._id,
            quantity: 1,
            unit_price: 16,
            line_total: 16,
          },
          {
            sale_id: sale3._id,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            quantity: 2,
            unit_price: 3,
            line_total: 6,
          },
          {
            sale_id: sale3._id,
            product_id: productMap["DEMO-PANCIT-ORI"]._id,
            quantity: 1,
            unit_price: 15,
            line_total: 15,
          },
        ],
        { session },
      );

      await StockMovement.insertMany(
        [
          {
            occurred_at: sale1.occurred_at,
            product_id: productMap["DEMO-COKE-290"]._id,
            movement_type: "OUT",
            quantity_change: -1,
            sale_id: sale1._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale1.occurred_at,
            product_id: productMap["DEMO-PANCIT-ORI"]._id,
            movement_type: "OUT",
            quantity_change: -2,
            sale_id: sale1._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale1.occurred_at,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            movement_type: "OUT",
            quantity_change: -6,
            sale_id: sale1._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale2.occurred_at,
            product_id: productMap["DEMO-555-SARDINES"]._id,
            movement_type: "OUT",
            quantity_change: -1,
            sale_id: sale2._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale2.occurred_at,
            product_id: productMap["DEMO-SAFEGUARD-135"]._id,
            movement_type: "OUT",
            quantity_change: -1,
            sale_id: sale2._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale2.occurred_at,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            movement_type: "OUT",
            quantity_change: -5,
            sale_id: sale2._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale3.occurred_at,
            product_id: productMap["DEMO-BEARBRAND-33"]._id,
            movement_type: "OUT",
            quantity_change: -1,
            sale_id: sale3._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale3.occurred_at,
            product_id: productMap["DEMO-NESCAFE-2G"]._id,
            movement_type: "OUT",
            quantity_change: -2,
            sale_id: sale3._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
          {
            occurred_at: sale3.occurred_at,
            product_id: productMap["DEMO-PANCIT-ORI"]._id,
            movement_type: "OUT",
            quantity_change: -1,
            sale_id: sale3._id,
            performed_by: SYSTEM_USER,
            reason: "Sale",
            note: "Auto-created by demo seed",
          },
        ],
        { session },
      );
    });

    console.log("Inserted demo baseline data");
  } finally {
    await session.endSession();
  }
}

async function main() {
  try {
    await connect();
    await clearCollections();
    await seedBaseline();
    console.log("Demo seed completed successfully");
  } catch (error) {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

main();
