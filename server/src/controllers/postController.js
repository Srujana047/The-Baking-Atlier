import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Post Controller
 * Handles all post-related operations: create, fetch, delete, like/unlike
 */

/**
 * Create a new casual post
 * POST /api/posts
 */
export const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  // Create and save the post
  const post = new Post({
    authorId: userId,
    authorName: userName,
    caption,
    likes: [],
    comments: [],
    likesCount: 0,
    commentsCount: 0
  });

  await post.save();

  // TODO: emit real-time event to connected clients (Socket.io - Phase 3+)
  // io.emit("post:created", post);

  return res.status(201).json({
    message: "Post created successfully",
    post: {
      id: post._id,
      caption: post.caption,
      authorId: post.authorId,
      authorName: post.authorName,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }
  });
});

/**
 * Fetch posts for the community feed
 * GET /api/posts
 * Pagination supported via skip and limit query params
 */
export const getPosts = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  // TODO: implement feed caching for performance
  // TODO: implement filtering options (by author, date range, etc.)

  const posts = await Post.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({ isDeleted: false });

  // TODO: populate comments count more efficiently for large feeds
  // TODO: implement infinite scrolling on frontend

  return res.json({
    posts,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

/**
 * Get a single post by ID
 * GET /api/posts/:postId
 */
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("comments")
    .lean();

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.isDeleted) {
    return res.status(404).json({ message: "Post has been deleted" });
  }

  return res.json({ post });
});

/**
 * Like a post
 * POST /api/posts/:postId/like
 */
export const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Check if user already liked this post
  const alreadyLiked = post.likes.some(
    (like) => like.userId.toString() === userId
  );

  if (alreadyLiked) {
    return res.status(400).json({ message: "You already liked this post" });
  }

  // Add like
  post.likes.push({ userId });
  post.likesCount = post.likes.length;

  await post.save();

  // TODO: send notification to post author (Phase 3+)

  return res.json({
    message: "Post liked",
    likesCount: post.likesCount
  });
});

/**
 * Unlike a post
 * DELETE /api/posts/:postId/like
 */
export const unlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Remove the user's like
  const likeIndex = post.likes.findIndex(
    (like) => like.userId.toString() === userId
  );

  if (likeIndex === -1) {
    return res.status(400).json({ message: "You haven't liked this post" });
  }

  post.likes.splice(likeIndex, 1);
  post.likesCount = post.likes.length;

  await post.save();

  return res.json({
    message: "Post unliked",
    likesCount: post.likesCount
  });
});

/**
 * Delete a post (soft delete - mark as deleted)
 * DELETE /api/posts/:postId
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Only post author or admin can delete
  if (post.authorId.toString() !== userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized to delete this post" });
  }

  post.isDeleted = true;
  await post.save();

  return res.json({ message: "Post deleted successfully" });
});

/**
 * Get posts by a specific user
 * GET /api/posts/user/:userId
 */
export const getPostsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  // TODO: implement user profile caching
  // TODO: add privacy controls (private posts, etc.)

  const posts = await Post.find({
    authorId: userId,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments({
    authorId: userId,
    isDeleted: false
  });

  return res.json({
    posts,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

export default {
  createPost,
  getPosts,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
  getPostsByUser
};
