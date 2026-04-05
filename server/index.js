import { connectDB } from "./db.js";
import app from "./app.js";

/**
 * Application entry point.
 * Owns infrastructure and HTTP server lifecycle.
 */
await connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
