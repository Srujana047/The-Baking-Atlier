import express from "express";
import { checkSchema } from "express-validator";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import * as postController from "../controllers/postController.js";
import { postValidators } from "../validators/feedValidators.js";

/**
 * Post Routes
 * All post routes require authentication
 */
const router = express.Router();

/**
 * POST /api/posts
 * Create a new casual post
 */
router.post(
  "/",
  requireAuth,
  checkSchema(postValidators.createPost),
  validateRequest,
  postController.createPost
);

/**
 * GET /api/posts
 * Fetch posts for community feed with pagination
 */
router.get(
  "/",
  checkSchema(postValidators.getPosts),
  validateRequest,
  postController.getPosts
);

/**
 * GET /api/posts/:postId
 * Get a single post by ID
 */
router.get("/:postId", postController.getPostById);

/**
 * POST /api/posts/:postId/like
 * Like a post
 */
router.post("/:postId/like", requireAuth, postController.likePost);

/**
 * DELETE /api/posts/:postId/like
 * Unlike a post
 */
router.delete("/:postId/like", requireAuth, postController.unlikePost);

/**
 * DELETE /api/posts/:postId
 * Delete a post (soft delete)
 */
router.delete("/:postId", requireAuth, postController.deletePost);

/**
 * GET /api/posts/user/:userId
 * Get all posts by a specific user
 */
router.get("/user/:userId", postController.getPostsByUser);

export default router;
