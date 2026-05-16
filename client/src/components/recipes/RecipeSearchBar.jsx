import { useState } from "react";
import "./RecipeSearchBar.css";

/**
 * RecipeSearchBar Component
 * Search bar for finding recipes by title, description, or author
 * 
 * Props:
 * - onSearch: function - callback with search query
 * - onClear: function - callback when search is cleared
 * - placeholder: string - input placeholder text
 */
export default function RecipeSearchBar({
  onSearch,
  onClear,
  placeholder = "Search recipes by name or ingredient..."
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="recipe-search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            aria-label="Search recipes"
          />
          <button
            type="submit"
            className="search-button"
            aria-label="Search"
            title="Search recipes"
          >
            🔍
          </button>
          {query && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* TODO: Phase 4 - add search suggestions/autocomplete */}
      {/* {isFocused && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion">
              {suggestion}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
