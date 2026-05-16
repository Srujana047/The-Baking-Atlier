import { Recipe } from "../models/Recipe.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Recipe Controller
 * Handles all recipe-related operations: create, fetch, update, delete, search, filter
 * Recipes are more structured and detailed than casual posts
 */

/**
 * Create a new recipe
 * POST /api/recipes
 */
export const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    ingredients,
    preparationSteps,
    category,
    difficulty = "Intermediate",
    bakingTime,
    tips
  } = req.body;

  const userId = req.user.id;
  const userName = req.user.name;

  // Transform preparation steps to include step numbers if not provided
  const steps = preparationSteps.map((step, index) => ({
    stepNumber: step.stepNumber || index + 1,
    description: step.description
  }));

  // Create and save the recipe
  const recipe = new Recipe({
    authorId: userId,
    authorName: userName,
    title,
    description,
    ingredients,
    preparationSteps: steps,
    category,
    difficulty,
    bakingTime,
    tips: tips || null,
    likes: [],
    likesCount: 0,
    commentsCount: 0
  });

  await recipe.save();

  // TODO: emit real-time event to connected clients (Socket.io - Phase 4+)
  // io.emit("recipe:created", recipe);

  return res.status(201).json({
    message: "Recipe created successfully",
    recipe: {
      id: recipe._id,
      title: recipe.title,
      category: recipe.category,
      difficulty: recipe.difficulty,
      bakingTime: recipe.bakingTime,
      authorName: recipe.authorName,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt
    }
  });
});

/**
 * Fetch all recipes with optional filtering and search
 * GET /api/recipes
 * Query params: skip, limit, category, difficulty, search
 */
export const getRecipes = asyncHandler(async (req, res) => {
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "12", 10);
  const { category, difficulty, search } = req.query;

  // Build filter object
  const filter = { isPublished: true };

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // TODO: implement advanced full-text search with relevance scoring
  // TODO: implement fuzzy matching for typo tolerance
  if (search) {
    filter.$text = { $search: search };
  }

  // Fetch recipes with pagination
  const recipes = await Recipe.find(filter)
    .select(
      "title description category difficulty bakingTime authorName authorId likesCount commentsCount createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const totalCount = await Recipe.countDocuments(filter);

  // TODO: implement recipe caching for performance
  // TODO: implement view count tracking

  return res.status(200).json({
    recipes,
    pagination: {
      skip,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

/**
 * Fetch a single recipe by ID
 * GET /api/recipes/:recipeId
 */
export const getRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId).populate(
    "authorId",
    "name email"
  );

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  // TODO: increment view count here
  // TODO: fetch related recipes based on category

  return res.status(200).json({ recipe });
});

/**
 * Update a recipe (only author can update)
 * PUT /api/recipes/:recipeId
 */
export const updateRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  // Check if user is the recipe author
  if (recipe.authorId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this recipe"
    });
  }

  // Update only provided fields
  if (updates.title !== undefined) recipe.title = updates.title;
  if (updates.description !== undefined) recipe.description = updates.description;
  if (updates.ingredients !== undefined) recipe.ingredients = updates.ingredients;
  if (updates.preparationSteps !== undefined) {
    recipe.preparationSteps = updates.preparationSteps.map((step, index) => ({
      stepNumber: step.stepNumber || index + 1,
      description: step.description
    }));
  }
  if (updates.category !== undefined) recipe.category = updates.category;
  if (updates.difficulty !== undefined) recipe.difficulty = updates.difficulty;
  if (updates.bakingTime !== undefined) recipe.bakingTime = updates.bakingTime;
  if (updates.tips !== undefined) recipe.tips = updates.tips;

  await recipe.save();

  return res.status(200).json({
    message: "Recipe updated successfully",
    recipe: {
      id: recipe._id,
      title: recipe.title,
      category: recipe.category,
      difficulty: recipe.difficulty,
      updatedAt: recipe.updatedAt
    }
  });
});

/**
 * Delete a recipe (only author can delete)
 * DELETE /api/recipes/:recipeId
 */
export const deleteRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.id;

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  // Check if user is the recipe author
  if (recipe.authorId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to delete this recipe"
    });
  }

  await Recipe.deleteOne({ _id: recipeId });

  // TODO: also delete associated comments when comment system is implemented

  return res.status(200).json({ message: "Recipe deleted successfully" });
});

/**
 * Search recipes by title, description, or author
 * GET /api/recipes/search/query
 * Query params: q (search query), category, difficulty
 */
export const searchRecipes = asyncHandler(async (req, res) => {
  const { q, category, difficulty } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const filter = { isPublished: true };

  // Text search on title and description
  filter.$text = { $search: q };

  if (category) {
    filter.category = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  // TODO: implement search with relevance scoring using $meta
  const recipes = await Recipe.find(filter)
    .select(
      "title description category difficulty bakingTime authorName authorId createdAt"
    )
    .limit(20)
    .lean();

  return res.status(200).json({
    query: q,
    results: recipes,
    count: recipes.length
  });
});

/**
 * Get recipes by category
 * GET /api/recipes/category/:categoryName
 */
export const getRecipesByCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "12", 10);

  // Validate category
  const validCategories = [
    "Cakes",
    "Cookies",
    "Bread",
    "Pastries",
    "Desserts",
    "Pies",
    "Muffins",
    "Brownies",
    "Other"
  ];

  if (!validCategories.includes(categoryName)) {
    return res.status(400).json({ message: "Invalid recipe category" });
  }

  const recipes = await Recipe.find({
    category: categoryName,
    isPublished: true
  })
    .select(
      "title description category difficulty bakingTime authorName authorId createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Recipe.countDocuments({
    category: categoryName,
    isPublished: true
  });

  return res.status(200).json({
    category: categoryName,
    recipes,
    pagination: {
      skip,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

/**
 * Get user's recipes
 * GET /api/recipes/user/:userId
 */
export const getUserRecipes = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const skip = parseInt(req.query.skip || "0", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  const recipes = await Recipe.find({
    authorId: userId,
    isPublished: true
  })
    .select("title category difficulty bakingTime likesCount createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Recipe.countDocuments({
    authorId: userId,
    isPublished: true
  });

  return res.status(200).json({
    userId,
    recipes,
    pagination: {
      skip,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

// TODO: Phase 4 - add like/unlike recipe endpoints
// TODO: Phase 4 - add recipe comments endpoints
// TODO: Phase 4 - add recipe bookmarking endpoints
// TODO: Phase 4 - add recipe rating endpoints
// TODO: Phase 4 - add advanced filtering by preparation time
// TODO: Phase 4 - add recipe trending/popularity endpoints
