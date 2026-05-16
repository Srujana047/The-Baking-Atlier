import RecipeCard from "./RecipeCard.jsx";
import "./RecipeGrid.css";

/**
 * RecipeGrid Component
 * Renders a responsive grid of recipe cards
 * 
 * Props:
 * - recipes: array - Array of recipe objects
 * - loading: boolean - Loading state
 * - onRecipeDelete: function - optional callback for recipe deletion
 */
export default function RecipeGrid({ recipes = [], loading = false, onRecipeDelete }) {
  if (loading) {
    return (
      <div className="recipe-grid-loading">
        <div className="spinner"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-grid-empty">
        <div className="empty-icon">🍞</div>
        <h3>No recipes found</h3>
        <p>Start by creating your first recipe or exploring other bakers' creations!</p>
        {/* TODO: add navigation button to create recipe */}
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id || recipe._id}
          recipe={{
            ...recipe,
            id: recipe._id || recipe.id
          }}
          onDelete={onRecipeDelete}
        />
      ))}
    </div>
  );
}
