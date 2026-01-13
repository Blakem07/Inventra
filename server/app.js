import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";

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

export default app;
