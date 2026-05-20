import mongoose from "mongoose";

/**
 * Report schema for storing user reports of inappropriate content.
 * Used for moderation purposes.
 * 
 * Phase 2: Basic reporting structure.
 * Phase 3+: Admin moderation dashboard, auto-actions, appeal system, etc.
 */
const reportSchema = new mongoose.Schema(
  {
    // User who filed the report
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // What is being reported
    reportedType: {
      type: String,
      enum: ["post", "comment", "recipe"],
      required: true,
      description: "Type of content being reported"
    },

    reportedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      description: "ID of reported content"
    },

    // Context: if reporting a comment, include the post ID
    // TODO: implement for better moderation context
    // contextPostId: mongoose.Schema.Types.ObjectId,

    // Reason for report
    reason: {
      type: String,
      enum: [
        "inappropriate",
        "spam",
        "harassment",
        "offensive",
        "other"
      ],
      required: true
    },

    // TODO: allow detailed description from user
    // description: String,

    // Admin review status
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
      index: true
    },

    // TODO: add admin notes field
    adminNotes: {
      type: String,
      trim: true,
      default: ""
    },

    // TODO: add action taken field (removed, warned, etc.)
    actionTaken: {
      type: String,
      trim: true,
      default: ""
    },

    // Reviewer reference for moderation history
    reviewedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Duplicate report tracking
    isDuplicate: {
      type: Boolean,
      default: false
    }

    // TODO: add reviewer ID when admin addresses report
    // reviewedById: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

// Index for finding pending reports for moderation
reportSchema.index({ status: 1, createdAt: -1 });

// Index for finding reports about specific content
reportSchema.index({ reportedType: 1, reportedId: 1 });

// Index for finding reports by reporter
reportSchema.index({ reporterId: 1, createdAt: -1 });

export const Report = mongoose.model("Report", reportSchema);
