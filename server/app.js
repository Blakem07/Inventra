import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";
import "./models/index.js";
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
 * Global error handler.
 * Must be registered last to catch errors from routes and services.
 */
app.use(errorHandler);

export default app;
