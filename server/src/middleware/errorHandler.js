export function errorHandler(err, _req, res, _next) {
  // Centralized error handler keeps routes clean.
  // TODO: add structured logging and environment-aware error responses.
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(status).json({ message });
}

