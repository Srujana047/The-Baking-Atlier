import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createHttpClient } from "../api/http";
import { createRecipeApi } from "../api/recipeApi.js";
import RecipeGrid from "../components/recipes/RecipeGrid.jsx";
import RecipeSearchBar from "../components/recipes/RecipeSearchBar.jsx";
import RecipeFilters from "../components/recipes/RecipeFilters.jsx";
import "./RecipesPage.css";

/**
 * RecipesPage Component
 * Main page displaying all recipes with search and filtering capabilities
 * Public page - accessible to all users
 */
export default function RecipesPage() {
  const { isAuthenticated, token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: null,
    difficulty: null
  });

  const ITEMS_PER_PAGE = 12;

  const http = createHttpClient({ getToken: () => token });
  const recipeApi = createRecipeApi(http);

  // Fetch recipes with current filters
  const fetchRecipes = async (page = 0) => {
    setLoading(true);
    setError("");

    try {
      const skip = page * ITEMS_PER_PAGE;
      let response;

      if (searchQuery.trim()) {
        // If search query exists, use search API
        response = await recipeApi.search(searchQuery, filters);
        setRecipes(response.results || []);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        // Otherwise fetch with filters
        response = await recipeApi.getRecipes({
          skip,
          limit: ITEMS_PER_PAGE,
          ...filters
        });
        setRecipes(response.recipes || []);
        setTotalPages(response.pagination?.pages || 0);
        setCurrentPage(page);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes on mount or when filters change
  useEffect(() => {
    fetchRecipes(0);
  }, [filters]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
    // Fetch with search query
    performSearch(query);
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(0);
    fetchRecipes(0);
  };

  // Perform search
  const performSearch = async (query) => {
    setLoading(true);
    setError("");

    try {
      const response = await searchRecipes(query, filters);
      setRecipes(response.results || []);
      setTotalPages(1);
    } catch (err) {
      setError(err.message || "Failed to search recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    // Reset search when filters change
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchRecipes(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchRecipes(currentPage - 1);
    }
  };

  return (
    <div className="recipes-page">
      <div className="container">
        {/* Page Header */}
        <div className="recipes-header">
          <div className="header-content">
            <h1>🍰 Recipe Collection</h1>
            <p>Discover professional baking recipes from our community</p>
          </div>
          {isAuthenticated && (
            <Link to="/recipes/create" className="btn btn-primary">
              + Create Recipe
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <RecipeSearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search recipes by name or ingredient..."
        />

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Close error">
              ✕
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="recipes-main">
          {/* Sidebar Filters */}
          <aside className="recipes-sidebar">
            <RecipeFilters
              onFilterChange={handleFilterChange}
              selectedCategory={filters.category}
              selectedDifficulty={filters.difficulty}
            />

            {/* TODO: Phase 4 - add "Most Viewed" or "Top Rated" recipes */}
            {/* <div className="featured-recipes">
              <h3>Trending Recipes</h3>
              <ul>
                <li><Link to="/recipes/123">Classic Chocolate Cake</Link></li>
              </ul>
            </div> */}
          </aside>

          {/* Recipes Grid */}
          <section className="recipes-content">
            {/* Results Summary */}
            <div className="results-summary">
              {searchQuery && (
                <span>
                  Search results for: <strong>"{searchQuery}"</strong>
                </span>
              )}
              {recipes.length > 0 && (
                <span className="recipe-count">
                  {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={recipes}
              loading={loading}
              // onRecipeDelete={handleDeleteRecipe} // TODO: Phase 3+
            />

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="pagination">
                <button
                  className="btn btn-ghost"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}

            {/* TODO: Phase 4 - add "Load More" button as alternative to pagination */}
            {/* <button className="btn btn-secondary" onClick={handleLoadMore}>
              Load More Recipes
            </button> */}
          </section>
        </div>

        {/* Sign Up Prompt for Non-Authenticated Users */}
        {!isAuthenticated && recipes.length > 0 && (
          <div className="signup-prompt">
            <div className="prompt-content">
              <h3>Want to share your favorite recipes?</h3>
              <p>Sign up or log in to create and share your baking recipes with the community!</p>
              <div className="prompt-actions">
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-ghost">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
