/**
 * Centralized Express error handler.
 *
 * Normalizes all  application errors into a consistent JSON response.
 * Expects services and controllers to attach an HTTP status code to errors.
 * Must be registered after all routes and middleware.
 */
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  res.status(status).json({
    error: {
      message: err.message ?? "Server error",
      status,
    },
  });
}
