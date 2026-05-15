/**
 * Tiny helper to avoid repetitive try/catch in async route handlers.
 * You can use it later as the project grows.
 */
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

