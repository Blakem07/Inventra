/**
 * Centralized Express error handler.
 *
 * Normalizes all application errors into a consistent JSON response.
 * Expects services and controllers to attach an HTTP status code to errors.
 * Must be registered after all routes and middleware.
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
    },
  });
}
