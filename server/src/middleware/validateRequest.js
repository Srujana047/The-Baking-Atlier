import { validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // Keep response simple and beginner friendly.
  // TODO: standardize error shapes across the API (codes, field maps).
  return res.status(400).json({
    message: "Validation error",
    errors: result.array().map((e) => ({ field: e.path, message: e.msg }))
  });
}

