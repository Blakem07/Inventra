import app from "./app.js";

/**
 * Application entry point.
 * Owns the HTTP server lifecycle.
 */
app.listen(process.env.PORT, () => {
  console.log("Server running");
});
