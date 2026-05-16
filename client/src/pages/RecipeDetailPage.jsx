import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createHttpClient } from "../api/http";
import { createRecipeApi } from "../api/recipeApi.js";
import "./RecipeDetailPage.css";

/**
 * RecipeDetailPage Component
 * Displays detailed view of a single recipe
 * Shows ingredients, steps, author info, and engagement
 */
export default function RecipeDetailPage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");

  const http = createHttpClient({ getToken: () => token });
  const recipeApi = createRecipeApi(http);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await recipeApi.getRecipe(recipeId);
        setRecipe(response.recipe);
      } catch (err) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  // Check if current user is the recipe author
  const isAuthor = isAuthenticated && user?.id === recipe?.authorId;

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      await recipeApi.delete(recipeId);
      // Redirect to recipes page
      navigate("/recipes");
    } catch (err) {
      setError(err.message || "Failed to delete recipe");
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="recipe-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <Link to="/recipes" className="btn btn-primary">
              ← Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Recipe not found</h2>
            <p>The recipe you're looking for doesn't exist.</p>
            <Link to="/recipes" className="btn btn-primary">
              ← Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="container">
        {/* Back Button */}
        <Link to="/recipes" className="back-link">
          ← Back to Recipes
        </Link>

        {/* Header with Image */}
        <div className="recipe-header">
          <div className="recipe-image">
            <div className="image-placeholder">
              {/* TODO: Phase 4 - display actual recipe image */}
              <span className="placeholder-icon">🍰</span>
            </div>
          </div>

          <div className="recipe-intro">
            <h1>{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>

            {/* Metadata */}
            <div className="recipe-metadata">
              <div className="meta-item">
                <span className="meta-label">Difficulty</span>
                <span className={`meta-value difficulty-${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{recipe.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Baking Time</span>
                <span className="meta-value">⏱️ {recipe.bakingTime} min</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="author-info">
              <div className="author-avatar">👤</div>
              <div className="author-details">
                <span className="author-name">{recipe.authorName}</span>
                <span className="recipe-date">Shared on {formatDate(recipe.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="recipe-actions">
              {/* TODO: Phase 3+ - add like button */}
              {/* <button className="btn btn-ghost">❤️ Like ({recipe.likesCount})</button> */}

              {/* TODO: Phase 3+ - add bookmark button */}
              {/* <button className="btn btn-ghost">🔖 Bookmark</button> */}

              {isAuthor && (
                <>
                  <Link to={`/recipes/${recipeId}/edit`} className="btn btn-secondary">
                    ✏️ Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="recipe-main">
          {/* Tabs */}
          <div className="recipe-tabs">
            <button
              className={`tab-button ${activeTab === "ingredients" ? "active" : ""}`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
            <button
              className={`tab-button ${activeTab === "steps" ? "active" : ""}`}
              onClick={() => setActiveTab("steps")}
            >
              Steps
            </button>
            {recipe.tips && (
              <button
                className={`tab-button ${activeTab === "tips" ? "active" : ""}`}
                onClick={() => setActiveTab("tips")}
              >
                Tips
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <section className="ingredients-section">
                <h2>Ingredients</h2>
                <div className="ingredients-list">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <input type="checkbox" id={`ing-${index}`} />
                        <label htmlFor={`ing-${index}`}>
                          <span className="ingredient-quantity">{ingredient.quantity}</span>
                          <span className="ingredient-name">{ingredient.item}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No ingredients listed</p>
                  )}
                </div>

                {/* TODO: Phase 4 - add scale recipe feature */}
                {/* <div className="scale-recipe">
                  <label htmlFor="scale">Scale Recipe:</label>
                  <input type="number" id="scale" min="0.5" max="4" step="0.5" defaultValue="1" />
                </div> */}
              </section>
            )}

            {/* Steps Tab */}
            {activeTab === "steps" && (
              <section className="steps-section">
                <h2>Preparation Steps</h2>
                <div className="steps-list">
                  {recipe.preparationSteps && recipe.preparationSteps.length > 0 ? (
                    recipe.preparationSteps.map((step, index) => (
                      <div key={index} className="step-item">
                        <div className="step-number">{step.stepNumber}</div>
                        <div className="step-content">
                          <p>{step.description}</p>
                        </div>
                        {/* TODO: Phase 4 - add step completion checkbox */}
                        {/* <input type="checkbox" /> */}
                      </div>
                    ))
                  ) : (
                    <p>No steps listed</p>
                  )}
                </div>
              </section>
            )}

            {/* Tips Tab */}
            {activeTab === "tips" && recipe.tips && (
              <section className="tips-section">
                <h2>Baking Tips</h2>
                <div className="tips-content">
                  <p>{recipe.tips}</p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* TODO: Phase 4 - Comments Section */}
        {/* <div className="recipe-comments">
          <h2>Comments ({recipe.commentsCount})</h2>
          <CommentForm />
          <CommentList />
        </div> */}

        {/* TODO: Phase 4 - Related Recipes */}
        {/* <div className="related-recipes">
          <h2>More from {recipe.authorName}</h2>
          <RecipeGrid recipes={authorRecipes} />
        </div> */}
      </div>
    </div>
  );
}
