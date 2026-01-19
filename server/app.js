import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";
import "./models/index.js";
import stockRoutes from "./routes/stockRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

/**
 * Builds and configures the Express application.
 * Does not start the HTTP server.
 */
const app = express();

app.use(express.json());

/**
 * Initializes required infrastructure before handling requests.
 */
await connectDB();

/**
 * Health check endpoint.
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * HTTP routes.
 * Must be registered before the global error handler.
 */
app.use("/stock", stockRoutes);
app.use("/sales", saleRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

/**
 * Global error handler.
 * Must be registered last to catch errors from routes and services.
 */
app.use(errorHandler);

export default app;
