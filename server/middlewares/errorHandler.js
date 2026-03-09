/**
 * Centralized Express error handler.
 *
 * Converts thrown application errors into a consistent JSON response shape:
 * { error: { message, status, ...metadata } }
 *
 * Special handling:
 * - MongoDB duplicate key errors (E11000) → HTTP 409.
 * - preserves additional error metadata (e.g. productId) when present.
 *
 * must be registered after all routes and middleware.
 */
export function errorHandler(err, req, res, next) {
  // MongoDB duplicate key (E11000)
  if (err && err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";

    return res.status(409).json({
      error: {
        message: `Duplicate value for ${field}.`,
        status: 409,
      },
    });
  }

  const status = err.status ?? 500;

  res.status(status).json({
    error: {
      message: err.message ?? "Server error",
      status,
      ...(err.productId && { productId: err.productId.toString() }), // For oversell
    },
  });
}
