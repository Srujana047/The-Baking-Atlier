import mongoose from "mongoose";

/**
 * AdminLog schema records moderation actions taken by administrators.
 * This supports activity history, auditing, and admin dashboard display.
 */
const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true,
      trim: true,
      description: "Short description of the admin action"
    },
    targetType: {
      type: String,
      enum: ["post", "comment", "recipe", "report", "user", "system"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    details: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

adminLogSchema.index({ createdAt: -1 });

export const AdminLog = mongoose.model("AdminLog", adminLogSchema);
