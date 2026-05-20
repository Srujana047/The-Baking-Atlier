import { Report } from "../models/Report.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { Recipe } from "../models/Recipe.js";
import { AdminLog } from "../models/AdminLog.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Report Controller
 * Handles content reporting for moderation purposes
 */

/**
 * Create a report for inappropriate content
 * POST /api/reports
 */
export const createReport = asyncHandler(async (req, res) => {
  const { reportedType, reportedId, reason } = req.body;
  const reporterId = req.user.id;

  // Verify the reported content exists
  if (reportedType === "post") {
    const post = await Post.findById(reportedId);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }
  } else if (reportedType === "comment") {
    const comment = await Comment.findById(reportedId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }
  } else if (reportedType === "recipe") {
    const recipe = await Recipe.findById(reportedId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
  }

  // TODO: prevent duplicate reports from same user within time period
  // const recentReport = await Report.findOne({
  //   reporterId,
  //   reportedType,
  //   reportedId,
  //   createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  // });

  // Create report
  const report = new Report({
    reporterId,
    reportedType,
    reportedId,
    reason,
    status: "pending"
  });

  await report.save();

  // TODO: send report notification to admin (email, dashboard alert, etc.)
  // TODO: implement automated report aggregation (flag content after N reports)

  return res.status(201).json({
    message: "Report submitted successfully",
    report: {
      id: report._id,
      reportedType: report.reportedType,
      reportedId: report.reportedId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt
    }
  });
});

/**
 * Get all reports (admin only)
 * GET /api/reports
 * 
 * TODO: implement admin role verification middleware
 */
export const getReports = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const status = req.query.status || "pending";

  // TODO: add admin authorization check
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Admin access required' });
  // }

  const reports = await Report.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Report.countDocuments({ status });

  return res.json({
    reports,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

/**
 * Get a single report by ID
 * GET /api/reports/:reportId
 */
export const getReportById = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  // TODO: add admin authorization check

  const report = await Report.findById(reportId).lean();

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  return res.json({ report });
});

/**
 * Update report status (admin only)
 * PATCH /api/reports/:reportId
 */
async function createReportLog(adminId, report, status) {
  try {
    await AdminLog.create({
      adminId,
      action: `Updated report status to ${status}`,
      targetType: "report",
      targetId: report._id,
      details: `Report for ${report.reportedType} ${report.reportedId} changed to ${status}`
    });
  } catch (error) {
    console.warn("Admin report log failed:", error.message);
  }
}

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.status = status;
  report.reviewedById = req.user.id;
  await report.save();

  if (req.user.role === "admin") {
    await createReportLog(req.user.id, report, status);
  }

  // TODO: if status is 'resolved', take appropriate action
  // (e.g., hide post, mark content for review, warn author)

  return res.json({
    message: "Report status updated",
    report
  });
});

/**
 * Get reports by a specific user
 * GET /api/reports/user/:userId
 */
export const getReportsByReporter = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  // TODO: allow users to only see their own reports (authorization check)

  const reports = await Report.find({ reporterId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Report.countDocuments({ reporterId: userId });

  return res.json({
    reports,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

export default {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  getReportsByReporter
};
