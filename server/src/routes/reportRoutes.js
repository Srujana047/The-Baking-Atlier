import express from "express";
import { checkSchema } from "express-validator";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import * as reportController from "../controllers/reportController.js";
import { reportValidators } from "../validators/feedValidators.js";

/**
 * Report Routes
 * All report routes require authentication
 */
const router = express.Router();

/**
 * POST /api/reports
 * Create a report for inappropriate content
 */
router.post(
  "/",
  requireAuth,
  checkSchema(reportValidators.createReport),
  validateRequest,
  reportController.createReport
);

/**
 * GET /api/reports
 * Get all reports (admin only)
 * TODO: add admin authorization middleware
 */
router.get("/", requireAuth, reportController.getReports);

/**
 * GET /api/reports/:reportId
 * Get a single report by ID (admin only)
 */
router.get("/:reportId", requireAuth, reportController.getReportById);

/**
 * PATCH /api/reports/:reportId
 * Update report status (admin only)
 * TODO: add admin authorization middleware
 */
router.patch("/:reportId", requireAuth, reportController.updateReportStatus);

/**
 * GET /api/reports/user/:userId
 * Get reports by a specific reporter
 */
router.get("/user/:userId", requireAuth, reportController.getReportsByReporter);

export default router;
