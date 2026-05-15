import mongoose from "mongoose";

/**
 * Comment schema for posts.
 * Stores user comments on casual baking posts.
 * 
 * Phase 2: Basic comments with flat structure.
 * Phase 3+: Threaded replies, nested comments, comment editing, etc.
 */
const commentSchema = new mongoose.Schema(
  {
    // Comment author
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorName: {
      type: String,
      required: true
    },

    // Post that this comment belongs to
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    },

    // Comment text content
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
      description: "Comment text"
    },

    // Engagement metrics
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // TODO: implement nested comment replies (Phase 3)
    // parentCommentId: mongoose.Schema.Types.ObjectId,

    // TODO: implement threaded view for replies
    // replies: [mongoose.Schema.Types.ObjectId],

    // Content status
    isDeleted: {
      type: Boolean,
      default: false
    },

    // TODO: add edit tracking (edited flag, editedAt timestamp)
  },
  { timestamps: true }
);

// Index for finding comments by post, sorted by creation time
commentSchema.index({ postId: 1, createdAt: 1 });

// Index for finding comments by author
commentSchema.index({ authorId: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
