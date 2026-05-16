import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "../components/recipes/RecipeForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createHttpClient } from "../api/http";
import { createRecipeApi } from "../api/recipeApi.js";
import "./CreateRecipePage.css";

/**
 * EditRecipePage Component
 * Dedicated page for editing an existing recipe
 * Only the recipe author can edit their recipe
 * 
 * This is a protected route, only authenticated users can access
 */
export default function EditRecipePage() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState(null);

  const http = createHttpClient({ getToken: () => token });
  const recipeApi = createRecipeApi(http);

  // Fetch recipe details on load
  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await recipeApi.getRecipe(recipeId);
        const recipeData = response.recipe;

        // Check if user is the author
        if (recipeData.authorId !== user?.id && recipeData.authorId?._id !== user?.id) {
          setError("You can only edit your own recipes");
          return;
        }

        setRecipe(recipeData);
      } catch (err) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId, user, recipeApi]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await recipeApi.update(recipeId, formData);
      // Success - redirect to recipe detail
      navigate(`/recipes/${response.recipe.id || recipeId}`);
    } catch (err) {
      setError(err.message || "Failed to update recipe");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Ask for confirmation if form has unsaved changes
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      navigate(`/recipes/${recipeId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="create-recipe-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="create-recipe-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "2rem", color: "#d32f2f" }}>
            <p>{error}</p>
            <button onClick={() => navigate("/recipes")} className="btn btn-primary">
              Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-recipe-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Edit Recipe</h1>
            <p>Update your recipe details and make it even better</p>
          </div>
          <div className="header-icon">📝</div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              border: "1px solid #f48fb1",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ color: "#c2185b" }}>{error}</span>
            <button
              onClick={() => setError("")}
              style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* User Info */}
        <div
          style={{
            backgroundColor: "#f5e6d3",
            borderLeft: "4px solid #ff9800",
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: "4px"
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <strong>Editing as:</strong> {user?.name}
          </p>
        </div>

        {/* Recipe Form */}
        {recipe && (
          <RecipeForm
            initialData={recipe}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Tips Section */}
        <div
          style={{
            backgroundColor: "#fff3e0",
            border: "1px solid #ffcc80",
            borderRadius: "8px",
            padding: "1.5rem",
            marginTop: "2rem"
          }}
        >
          <h3 style={{ marginTop: 0 }}>💡 Editing Tips</h3>
          <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
            <li>Make sure measurements are clear and consistent</li>
            <li>Update photos if your recipe looks different now</li>
            <li>Check that all steps are in the right order</li>
            <li>Add any new tips you've learned since creating it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
