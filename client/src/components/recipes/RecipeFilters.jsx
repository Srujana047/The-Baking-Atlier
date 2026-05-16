import { useState } from "react";
import "./RecipeFilters.css";

/**
 * RecipeFilters Component
 * Displays filter options for recipes (category, difficulty, baking time)
 * 
 * Props:
 * - onFilterChange: function - callback when filters change
 * - selectedCategory: string - currently selected category
 * - selectedDifficulty: string - currently selected difficulty
 */
export default function RecipeFilters({
  onFilterChange,
  selectedCategory = null,
  selectedDifficulty = null
}) {
  const [showFilters, setShowFilters] = useState(true);

  const categories = [
    "Cakes",
    "Cookies",
    "Bread",
    "Pastries",
    "Desserts",
    "Pies",
    "Muffins",
    "Brownies"
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? null : category;
    onFilterChange({
      category: newCategory,
      difficulty: selectedDifficulty
    });
  };

  const handleDifficultyClick = (difficulty) => {
    const newDifficulty = selectedDifficulty === difficulty ? null : difficulty;
    onFilterChange({
      category: selectedCategory,
      difficulty: newDifficulty
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: null,
      difficulty: null
    });
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty;

  return (
    <div className="recipe-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          {showFilters ? "▼" : "▶"}
        </button>
      </div>

      {showFilters && (
        <div className="filters-content">
          {/* Category Filter */}
          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-option ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="filter-group">
            <h4>Difficulty</h4>
            <div className="filter-options">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  className={`filter-option ${
                    selectedDifficulty === difficulty ? "active" : ""
                  }`}
                  onClick={() => handleDifficultyClick(difficulty)}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* TODO: Phase 3+ - add baking time range slider */}
          {/* <div className="filter-group">
            <h4>Baking Time</h4>
            <div className="time-range">
              <input type="range" min="0" max="480" />
              <span>0 - 480 minutes</span>
            </div>
          </div> */}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {selectedCategory && (
            <span className="filter-tag">
              {selectedCategory}
              <button
                onClick={() =>
                  onFilterChange({
                    category: null,
                    difficulty: selectedDifficulty
                  })
                }
                aria-label={`Remove ${selectedCategory} filter`}
              >
                ✕
              </button>
            </span>
          )}
          {selectedDifficulty && (
            <span className="filter-tag">
              {selectedDifficulty}
              <button
                onClick={() =>
                  onFilterChange({
                    category: selectedCategory,
                    difficulty: null
                  })
                }
                aria-label={`Remove ${selectedDifficulty} filter`}
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
