import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Comment Controller
 * Handles all comment-related operations: create, fetch, delete
 */

/**
 * Create a new comment on a post
 * POST /api/posts/:postId/comments
 */
export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Create comment
  const comment = new Comment({
    authorId: userId,
    authorName: userName,
    postId,
    text
  });

  await comment.save();

  // Update post's comments array and count
  post.comments.push(comment._id);
  post.commentsCount = post.comments.length;
  await post.save();

  // TODO: send notification to post author (Phase 3+)
  // TODO: emit real-time comment event (Socket.io - Phase 3+)

  return res.status(201).json({
    message: "Comment created successfully",
    comment: {
      id: comment._id,
      text: comment.text,
      authorId: comment.authorId,
      authorName: comment.authorName,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }
  });
});

/**
 * Get all comments for a post
 * GET /api/posts/:postId/comments
 */
export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  // TODO: implement comment pagination optimization
  // TODO: implement virtual comments for nested structure

  const comments = await Comment.find({
    postId,
    isDeleted: false
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Comment.countDocuments({
    postId,
    isDeleted: false
  });

  return res.json({
    comments,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

/**
 * Get a single comment by ID
 * GET /api/comments/:commentId
 */
export const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).lean();

  if (!comment || comment.isDeleted) {
    return res.status(404).json({ message: "Comment not found" });
  }

  return res.json({ comment });
});

/**
 * Delete a comment
 * DELETE /api/comments/:commentId
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Only comment author or admin can delete
  // TODO: add admin role check
  if (comment.authorId.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete this comment" });
  }

  // Soft delete
  comment.isDeleted = true;
  await comment.save();

  // Update post's comment count
  const post = await Post.findById(comment.postId);
  if (post) {
    post.commentsCount = Math.max(0, post.commentsCount - 1);
    await post.save();
  }

  return res.json({ message: "Comment deleted successfully" });
});

/**
 * Get comments by a specific user
 * GET /api/comments/user/:userId
 */
export const getCommentsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  const comments = await Comment.find({
    authorId: userId,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Comment.countDocuments({
    authorId: userId,
    isDeleted: false
  });

  return res.json({
    comments,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

// TODO: implement comment liking system (Phase 3+)
// export const likeComment = asyncHandler(async (req, res) => { ... });
// export const unlikeComment = asyncHandler(async (req, res) => { ... });

export default {
  createComment,
  getComments,
  getCommentById,
  deleteComment,
  getCommentsByUser
};
