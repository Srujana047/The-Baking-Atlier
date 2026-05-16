import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/recipes/RecipeForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createHttpClient } from "../api/http";
import { createRecipeApi } from "../api/recipeApi.js";
import "./CreateRecipePage.css";

/**
 * CreateRecipePage Component
 * Dedicated page for creating a new recipe
 * Separate from casual posts - more detailed and structured
 * 
 * This is a protected route, only authenticated users can access
 */
export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const http = createHttpClient({ getToken: () => token });
  const recipeApi = createRecipeApi(http);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await recipeApi.create(formData);
      // Success - redirect to recipes page or recipe detail
      navigate(`/recipes/${response.recipe.id}`);
    } catch (err) {
      setError(err.message || "Failed to create recipe");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Ask for confirmation if form has unsaved changes
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      navigate("/recipes");
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>📖 Share Your Recipe</h1>
            <p>Create a detailed professional recipe to share with the bakery community</p>
          </div>
          <div className="header-icon">🍰</div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button
              className="close-error"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        )}

        {/* User Info */}
        <div className="user-info-box">
          <span className="info-label">Creating as:</span>
          <span className="user-name">{user?.name || "Baker"}</span>
        </div>

        {/* Recipe Form */}
        <RecipeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        {/* Tips Section */}
        <div className="tips-section">
          <h3>💡 Tips for a Great Recipe</h3>
          <ul className="tips-list">
            <li>Be specific with measurements - use weights when possible</li>
            <li>Describe each step clearly so anyone can follow</li>
            <li>Include your best tips and tricks for success</li>
            <li>Choose the difficulty level accurately</li>
            <li>Add helpful baking time estimates</li>
            {/* TODO: Phase 4 - add image optimization tips */}
            {/* <li>Upload high-quality, well-lit photos of your creation</li> */}
          </ul>
        </div>

        {/* TODO: Phase 4 - add recipe templates/examples */}
        {/* <div className="templates-section">
          <h3>Recipe Templates</h3>
          <div className="template-cards">
            <button className="template-card">Cookies Recipe Template</button>
            <button className="template-card">Bread Recipe Template</button>
            <button className="template-card">Cake Recipe Template</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
