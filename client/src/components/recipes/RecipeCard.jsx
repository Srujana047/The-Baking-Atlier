import { Link } from "react-router-dom";
import "./RecipeCard.css";

/**
 * RecipeCard Component
 * Displays a single recipe in a card format for grid/list views
 * 
 * Props:
 * - recipe: object - Recipe data { id, title, description, category, difficulty, bakingTime, authorName, createdAt }
 * - onDelete: function - optional callback for delete action
 */
export default function RecipeCard({ recipe, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete && window.confirm("Are you sure you want to delete this recipe?")) {
      onDelete(recipe.id);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "difficulty-beginner";
      case "Intermediate":
        return "difficulty-intermediate";
      case "Advanced":
        return "difficulty-advanced";
      default:
        return "difficulty-intermediate";
    }
  };

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
      <article className="recipe-card">
        {/* Image Placeholder */}
        <div className="recipe-card-image">
          <div className="image-placeholder">
            {/* TODO: Phase 4 - replace with actual recipe image */}
            <span className="placeholder-icon">🍰</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="recipe-card-content">
          <h3 className="recipe-card-title">{recipe.title}</h3>

          <p className="recipe-card-description">
            {recipe.description.substring(0, 80)}...
          </p>

          {/* Metadata Tags */}
          <div className="recipe-card-meta">
            <span className={`badge badge-difficulty ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className="badge badge-category">{recipe.category}</span>
            <span className="badge badge-time">⏱️ {recipe.bakingTime}m</span>
          </div>

          {/* Footer */}
          <div className="recipe-card-footer">
            <small className="recipe-author">By {recipe.authorName}</small>
            <small className="recipe-date">{formatDate(recipe.createdAt)}</small>
          </div>

          {/* TODO: Phase 3+ - add likes counter */}
          {/* {recipe.likesCount > 0 && (
            <div className="recipe-card-engagement">
              <span className="likes-count">❤️ {recipe.likesCount}</span>
            </div>
          )} */}
        </div>

        {/* TODO: Phase 3+ - add delete button for author */}
        {/* {isAuthor && (
          <button
            className="recipe-card-delete"
            onClick={handleDelete}
            title="Delete recipe"
          >
            ✕
          </button>
        )} */}
      </article>
    </Link>
  );
}
