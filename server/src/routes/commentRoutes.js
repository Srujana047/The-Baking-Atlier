import express from "express";
import { checkSchema } from "express-validator";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import * as commentController from "../controllers/commentController.js";
import { commentValidators } from "../validators/feedValidators.js";

/**
 * Comment Routes
 * Nested under /api/posts/:postId/comments
 */
const router = express.Router({ mergeParams: true });

/**
 * POST /api/posts/:postId/comments
 * Create a new comment on a post
 */
router.post(
  "/",
  requireAuth,
  checkSchema(commentValidators.createComment),
  validateRequest,
  commentController.createComment
);

/**
 * GET /api/posts/:postId/comments
 * Get all comments for a post with pagination
 */
router.get("/", commentController.getComments);

/**
 * GET /api/comments/:commentId
 * Get a single comment by ID
 */
router.get("/:commentId", commentController.getCommentById);

/**
 * DELETE /api/comments/:commentId
 * Delete a comment (soft delete)
 */
router.delete("/:commentId", requireAuth, commentController.deleteComment);

/**
 * GET /api/comments/user/:userId
 * Get all comments by a specific user
 */
router.get("/user/:userId", commentController.getCommentsByUser);

export default router;
