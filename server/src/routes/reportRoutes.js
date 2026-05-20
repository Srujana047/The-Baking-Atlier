import express from "express";
import { checkSchema } from "express-validator";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
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
router.get("/", requireAuth, requireAdmin, reportController.getReports);

/**
 * GET /api/reports/user/:userId
 * Get reports by a specific reporter
 */
router.get("/user/:userId", requireAuth, reportController.getReportsByReporter);

/**
 * GET /api/reports/:reportId
 * Get a single report by ID (admin only)
 */
router.get("/:reportId", requireAuth, requireAdmin, reportController.getReportById);

/**
 * PATCH /api/reports/:reportId
 * Update report status (admin only)
 */
router.patch(
  "/:reportId",
  requireAuth,
  requireAdmin,
  checkSchema(reportValidators.updateReportStatus),
  validateRequest,
  reportController.updateReportStatus
);

export default router;
