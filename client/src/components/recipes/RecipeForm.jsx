import { useState, useRef } from "react";
import "./RecipeForm.css";

/**
 * RecipeForm Component
 * Form for creating and editing recipes
 * Includes ingredients and preparation steps dynamic arrays
 * 
 * Props:
 * - onSubmit: function - callback when form is submitted
 * - onCancel: function - callback when user cancels
 * - initialData: object - optional initial recipe data for editing
 * - isSubmitting: boolean - show loading state
 */
export default function RecipeForm({
  onSubmit,
  onCancel,
  initialData = null,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Cakes",
    difficulty: initialData?.difficulty || "Intermediate",
    bakingTime: initialData?.bakingTime || 30,
    ingredients: initialData?.ingredients || [{ item: "", quantity: "" }],
    preparationSteps: initialData?.preparationSteps || [{ description: "" }],
    tips: initialData?.tips || ""
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic"); // basic, ingredients, steps, tips

  // Handle basic field changes
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    setFormData((prev) => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Add new ingredient
  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: "", quantity: "" }]
    }));
  };

  // Remove ingredient
  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle preparation step changes
  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.preparationSteps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      description: value
    };
    setFormData((prev) => ({
      ...prev,
      preparationSteps: updatedSteps
    }));
  };

  // Add new preparation step
  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      preparationSteps: [...prev.preparationSteps, { description: "" }]
    }));
  };

  // Remove preparation step
  const removeStep = (index) => {
    if (formData.preparationSteps.length > 1) {
      setFormData((prev) => ({
        ...prev,
        preparationSteps: prev.preparationSteps.filter((_, i) => i !== index)
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Recipe title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.bakingTime || formData.bakingTime < 1) {
      newErrors.bakingTime = "Baking time must be at least 1 minute";
    }

    // Validate ingredients
    const emptyIngredients = formData.ingredients.some(
      (ing) => !ing.item.trim() || !ing.quantity.trim()
    );
    if (emptyIngredients) {
      newErrors.ingredients = "All ingredients must have item and quantity";
    }

    // Validate preparation steps
    const emptySteps = formData.preparationSteps.some(
      (step) => !step.description.trim()
    );
    if (emptySteps) {
      newErrors.preparationSteps = "All steps must have a description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categories = [
    "Cakes",
    "Cookies",
    "Bread",
    "Pastries",
    "Desserts",
    "Pies",
    "Muffins",
    "Brownies",
    "Other"
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="recipe-form-container">
      <form className="recipe-form" onSubmit={handleSubmit}>
        {/* Tab Navigation */}
        <div className="recipe-form-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "ingredients" ? "active" : ""}`}
            onClick={() => setActiveTab("ingredients")}
          >
            Ingredients
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "steps" ? "active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            Steps
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            Tips
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="form-tab-content">
            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g., Classic Chocolate Cake"
                disabled={isSubmitting}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Brief description of your recipe..."
                rows="4"
                disabled={isSubmitting}
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="form-error">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty *</label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleFieldChange("difficulty", e.target.value)}
                  disabled={isSubmitting}
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bakingTime">Baking Time (minutes) *</label>
              <input
                id="bakingTime"
                type="number"
                min="1"
                max="480"
                value={formData.bakingTime}
                onChange={(e) => handleFieldChange("bakingTime", parseInt(e.target.value))}
                disabled={isSubmitting}
              />
              {errors.bakingTime && (
                <span className="form-error">{errors.bakingTime}</span>
              )}
            </div>

            {/* TODO: Phase 4 - add image upload */}
            {/* <div className="form-group">
              <label htmlFor="image">Recipe Image</label>
              <input type="file" id="image" accept="image/*" />
              <p className="form-hint">Recommended: 800x600px, max 5MB</p>
            </div> */}
          </div>
        )}

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && (
          <div className="form-tab-content">
            <div className="ingredients-list">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <div className="ingredient-item">
                    <input
                      type="text"
                      placeholder="e.g., All-purpose flour"
                      value={ingredient.item}
                      onChange={(e) =>
                        handleIngredientChange(index, "item", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ingredient-quantity">
                    <input
                      type="text"
                      placeholder="e.g., 2 cups"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        handleIngredientChange(index, "quantity", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeIngredient(index)}
                      disabled={isSubmitting}
                      title="Remove ingredient"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.ingredients && (
              <span className="form-error">{errors.ingredients}</span>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addIngredient}
              disabled={isSubmitting}
            >
              + Add Ingredient
            </button>
          </div>
        )}

        {/* Preparation Steps Tab */}
        {activeTab === "steps" && (
          <div className="form-tab-content">
            <div className="steps-list">
              {formData.preparationSteps.map((step, index) => (
                <div key={index} className="step-row">
                  <div className="step-number">Step {index + 1}</div>
                  <div className="step-input">
                    <textarea
                      placeholder="Describe this step..."
                      value={step.description}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      rows="3"
                      disabled={isSubmitting}
                    />
                  </div>
                  {formData.preparationSteps.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeStep(index)}
                      disabled={isSubmitting}
                      title="Remove step"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.preparationSteps && (
              <span className="form-error">{errors.preparationSteps}</span>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addStep}
              disabled={isSubmitting}
            >
              + Add Step
            </button>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === "tips" && (
          <div className="form-tab-content">
            <div className="form-group">
              <label htmlFor="tips">Baking Tips & Tricks (Optional)</label>
              <textarea
                id="tips"
                value={formData.tips}
                onChange={(e) => handleFieldChange("tips", e.target.value)}
                placeholder="Share any tips, tricks, or variations..."
                rows="6"
                disabled={isSubmitting}
              />
              <p className="form-hint">
                Max 500 characters • TODO: add rich text editor (Phase 4)
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Recipe"}
          </button>
        </div>
      </form>

      {/* TODO: Phase 3+ - add form progress indicator */}
      {/* {showProgress && (
        <div className="form-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span>{progress}% Complete</span>
        </div>
      )} */}
    </div>
  );
}
