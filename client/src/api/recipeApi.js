/**
 * Recipe API Service
 * Handles all recipe-related HTTP requests to the backend
 */

export function createRecipeApi(http) {
  return {
    /**
     * Create a new recipe
     * @param {Object} recipeData - Recipe data (title, description, ingredients, etc.)
     * @returns {Promise} Recipe creation response
     */
    create: async (recipeData) => {
      try {
        const { data } = await http.post("/recipes", recipeData);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create recipe");
      }
    },

    /**
     * Fetch all recipes with optional filtering
     * @param {Object} filters - { skip, limit, category, difficulty, search }
     * @returns {Promise} Array of recipes and pagination info
     */
    getRecipes: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        if (filters.skip !== undefined) params.append("skip", filters.skip);
        if (filters.limit !== undefined) params.append("limit", filters.limit);
        if (filters.category) params.append("category", filters.category);
        if (filters.difficulty) params.append("difficulty", filters.difficulty);
        if (filters.search) params.append("search", filters.search);

        const queryString = params.toString();
        const url = queryString ? `/recipes?${queryString}` : "/recipes";

        const { data } = await http.get(url);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch recipes");
      }
    },

    /**
     * Fetch a single recipe by ID
     * @param {string} recipeId - Recipe MongoDB ID
     * @returns {Promise} Recipe details
     */
    getRecipe: async (recipeId) => {
      try {
        const { data } = await http.get(`/recipes/${recipeId}`);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch recipe");
      }
    },

    /**
     * Update a recipe
     * @param {string} recipeId - Recipe MongoDB ID
     * @param {Object} updates - Fields to update
     * @returns {Promise} Updated recipe info
     */
    update: async (recipeId, updates) => {
      try {
        const { data } = await http.put(`/recipes/${recipeId}`, updates);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update recipe");
      }
    },

    /**
     * Delete a recipe
     * @param {string} recipeId - Recipe MongoDB ID
     * @returns {Promise} Deletion confirmation
     */
    delete: async (recipeId) => {
      try {
        const { data } = await http.delete(`/recipes/${recipeId}`);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete recipe");
      }
    },

    /**
     * Search recipes
     * @param {string} query - Search query
     * @param {Object} filters - { category, difficulty }
     * @returns {Promise} Search results
     */
    search: async (query, filters = {}) => {
      try {
        const params = new URLSearchParams({ q: query });
        if (filters.category) params.append("category", filters.category);
        if (filters.difficulty) params.append("difficulty", filters.difficulty);

        const { data } = await http.get(`/recipes/search/query?${params.toString()}`);
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to search recipes");
      }
    },

    /**
     * Fetch recipes by category
     * @param {string} categoryName - Category name
     * @param {Object} pagination - { skip, limit }
     * @returns {Promise} Recipes in category
     */
    getByCategory: async (categoryName, pagination = {}) => {
      try {
        const params = new URLSearchParams();
        if (pagination.skip !== undefined) params.append("skip", pagination.skip);
        if (pagination.limit !== undefined) params.append("limit", pagination.limit);

        const queryString = params.toString();
        const url = queryString
          ? `/recipes/category/${categoryName}?${queryString}`
          : `/recipes/category/${categoryName}`;

        const { data } = await http.get(url);
        return data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch recipes by category"
        );
      }
    },

    /**
     * Fetch recipes by user/author
     * @param {string} userId - User MongoDB ID
     * @param {Object} pagination - { skip, limit }
     * @returns {Promise} User's recipes
     */
    getByUser: async (userId, pagination = {}) => {
      try {
        const params = new URLSearchParams();
        if (pagination.skip !== undefined) params.append("skip", pagination.skip);
        if (pagination.limit !== undefined) params.append("limit", pagination.limit);

        const queryString = params.toString();
        const url = queryString
          ? `/recipes/user/${userId}?${queryString}`
          : `/recipes/user/${userId}`;

        const { data } = await http.get(url);
        return data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch user recipes"
        );
      }
    },

    // TODO: Phase 4 - implement recipe engagement endpoints
    // like: async (recipeId) => { ... },
    // unlike: async (recipeId) => { ... },
    // bookmark: async (recipeId) => { ... },
    // rate: async (recipeId, rating) => { ... },
  };
}