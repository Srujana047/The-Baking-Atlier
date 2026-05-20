import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
import { Report } from "../models/Report.js";
import { AdminLog } from "../models/AdminLog.js";
import asyncHandler from "../middleware/asyncHandler.js";

async function createAdminLog({ adminId, action, targetType, targetId = null, details = "" }) {
  try {
    await AdminLog.create({ adminId, action, targetType, targetId, details });
  } catch (error) {
    console.warn("Failed to create admin log:", error.message);
  }
}

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments({ isDeleted: false });
  const totalRecipes = await Recipe.countDocuments();
  const totalComments = await Comment.countDocuments({ isDeleted: false });
  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: "pending" });
  const recentActivities = await AdminLog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return res.json({
    totalUsers,
    totalPosts,
    totalRecipes,
    totalComments,
    totalReports,
    pendingReports,
    recentActivities
  });
});

export const getReports = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const status = req.query.status || "pending";

  const reports = await Report.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("reporterId", "name email")
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

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.status = status;
  await report.save();

  await createAdminLog({
    adminId: req.user.id,
    action: `Updated report status to ${status}`,
    targetType: "report",
    targetId: report._id,
    details: `Report for ${report.reportedType} ${report.reportedId} changed to ${status}`
  });

  return res.json({
    message: "Report status updated",
    report
  });
});

export const getPosts = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const search = req.query.search?.trim() || "";

  const filter = {};
  if (search) {
    filter.caption = { $regex: search, $options: "i" };
  }

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments(filter);

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

export const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.isDeleted) {
    return res.status(400).json({ message: "Post is already deleted" });
  }

  post.isDeleted = true;
  await post.save();

  await createAdminLog({
    adminId: req.user.id,
    action: "Deleted post",
    targetType: "post",
    targetId: post._id,
    details: `Deleted post caption: ${post.caption.slice(0, 80)}`
  });

  return res.json({ message: "Post deleted successfully" });
});

export const getComments = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const search = req.query.search?.trim() || "";

  const filter = {};
  if (search) {
    filter.text = { $regex: search, $options: "i" };
  }

  const comments = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Comment.countDocuments(filter);

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

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.isDeleted) {
    return res.status(400).json({ message: "Comment is already deleted" });
  }

  comment.isDeleted = true;
  await comment.save();

  const post = await Post.findById(comment.postId);
  if (post) {
    post.commentsCount = Math.max(0, post.commentsCount - 1);
    await post.save();
  }

  await createAdminLog({
    adminId: req.user.id,
    action: "Deleted comment",
    targetType: "comment",
    targetId: comment._id,
    details: `Comment text: ${comment.text.slice(0, 80)}`
  });

  return res.json({ message: "Comment deleted successfully" });
});

export const getRecipes = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const search = req.query.search?.trim() || "";

  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const recipes = await Recipe.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Recipe.countDocuments(filter);

  return res.json({
    recipes,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

export const deleteRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  await Recipe.deleteOne({ _id: recipeId });

  await createAdminLog({
    adminId: req.user.id,
    action: "Deleted recipe",
    targetType: "recipe",
    targetId: recipe._id,
    details: `Recipe title: ${recipe.title}`
  });

  return res.json({ message: "Recipe deleted successfully" });
});

export const getUsers = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const search = req.query.search?.trim() || "";
  const role = req.query.role;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select("name email role postsCount recipesCount createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments(filter);

  return res.json({
    users,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});

export const getLogs = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "20", 10);

  const logs = await AdminLog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("adminId", "name email")
    .lean();

  const total = await AdminLog.countDocuments();

  return res.json({
    logs,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total
    }
  });
});
