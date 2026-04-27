import "dotenv/config";
import express from "express";
import cors from "cors";
import "./models/index.js";
import stockRoutes from "./routes/stockRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { requireDemoAccess } from "./middlewares/requireDemoAccess.js";
import { verifyFrontendOrigin } from "./middlewares/verifyFrontendOrigin.js";

/**
 * Builds and configures the Express application.
 * Does not start the HTTP server.
 */
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());

app.use(cookieParser());

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
app.use("/stock", verifyFrontendOrigin, requireDemoAccess, stockRoutes);
app.use("/sales", verifyFrontendOrigin, requireDemoAccess, saleRoutes);
app.use("/categories", verifyFrontendOrigin, requireDemoAccess, categoryRoutes);
app.use("/products", verifyFrontendOrigin, requireDemoAccess, productRoutes);
app.use("/dashboard", verifyFrontendOrigin, requireDemoAccess, dashboardRoutes);
app.use("/reports", verifyFrontendOrigin, requireDemoAccess, reportRoutes);

app.use("/demo", demoRoutes);

/**
 * Global error handler.
 * Must be registered last to catch errors from routes and services.
 */
app.use(errorHandler);

export default app;
