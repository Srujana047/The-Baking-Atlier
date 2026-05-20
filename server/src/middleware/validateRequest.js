import { validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // Keep response simple and beginner friendly.
  // TODO: standardize error shapes across the API (codes, field maps).
  return sendError(res, 400, "Validation error", result.array().map((e) => ({ field: e.path, message: e.msg })));
}

