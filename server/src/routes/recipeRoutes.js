import express from "express";
import { checkSchema } from "express-validator";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import * as recipeController from "../controllers/recipeController.js";
import { recipeValidators } from "../validators/recipeValidators.js";

/**
 * Recipe Routes
 * All recipe routes require authentication for creation/modification
 */
const router = express.Router();

/**
 * POST /api/recipes
 * Create a new recipe
 * Protected route - requires authentication
 */
router.post(
  "/",
  requireAuth,
  checkSchema(recipeValidators.createRecipe),
  validateRequest,
  recipeController.createRecipe
);

/**
 * GET /api/recipes
 * Fetch all recipes with optional filtering and pagination
 * Query params: skip, limit, category, difficulty, search
 * Public route - no authentication required
 */
router.get(
  "/",
  checkSchema(recipeValidators.getRecipes),
  validateRequest,
  recipeController.getRecipes
);

/**
 * GET /api/recipes/search/query
 * Search recipes by query
 * Query params: q (required), category, difficulty
 * Public route
 */
router.get(
  "/search/query",
  checkSchema(recipeValidators.getRecipes),
  validateRequest,
  recipeController.searchRecipes
);

/**
 * GET /api/recipes/category/:categoryName
 * Get recipes filtered by category
 * Query params: skip, limit
 * Public route
 */
router.get(
  "/category/:categoryName",
  checkSchema(recipeValidators.getRecipes),
  validateRequest,
  recipeController.getRecipesByCategory
);

/**
 * GET /api/recipes/user/:userId
 * Get all recipes created by a specific user
 * Query params: skip, limit
 * Public route
 */
router.get(
  "/user/:userId",
  checkSchema(recipeValidators.getRecipes),
  validateRequest,
  recipeController.getUserRecipes
);

/**
 * GET /api/recipes/:recipeId
 * Fetch a single recipe by ID
 * Public route
 * Must come after specific routes to avoid matching dynamic params
 */
router.get(
  "/:recipeId",
  checkSchema(recipeValidators.recipeId),
  validateRequest,
  recipeController.getRecipe
);

/**
 * PUT /api/recipes/:recipeId
 * Update a recipe (only author can update)
 * Protected route - requires authentication
 */
router.put(
  "/:recipeId",
  requireAuth,
  checkSchema(recipeValidators.updateRecipe),
  validateRequest,
  recipeController.updateRecipe
);

/**
 * DELETE /api/recipes/:recipeId
 * Delete a recipe (only author can delete)
 * Protected route - requires authentication
 */
router.delete(
  "/:recipeId",
  requireAuth,
  checkSchema(recipeValidators.recipeId),
  validateRequest,
  recipeController.deleteRecipe
);

// TODO: Phase 4 - add route for liking/unliking recipes
// router.post("/:recipeId/like", requireAuth, recipeController.likeRecipe);
// router.delete("/:recipeId/like", requireAuth, recipeController.unlikeRecipe);

// TODO: Phase 4 - add route for recipe comments
// router.post("/:recipeId/comments", requireAuth, recipeController.addComment);
// router.get("/:recipeId/comments", recipeController.getComments);

// TODO: Phase 4 - add route for bookmarking recipes
// router.post("/:recipeId/bookmark", requireAuth, recipeController.bookmarkRecipe);
// router.delete("/:recipeId/bookmark", requireAuth, recipeController.removeBookmark);

// TODO: Phase 4 - add route for rating recipes
// router.post("/:recipeId/rate", requireAuth, recipeController.rateRecipe);

export default router;
