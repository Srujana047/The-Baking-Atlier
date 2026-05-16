import { useNavigate } from "react-router-dom";
import "./CreatePostModal.css";

/**
 * CreatePostModal Component
 * Modal for selecting between creating a casual post or a recipe
 * 
 * Props:
 * - isOpen: boolean - whether modal is visible
 * - onClose: function - callback to close modal
 */
export default function CreatePostModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCasualPost = () => {
    onClose();
    // Scroll to create post form on dashboard
    document.getElementById("create-post-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRecipe = () => {
    onClose();
    navigate("/recipes/create");
  };

  return (
    <div className="create-post-modal-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
          title="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <h2>What would you like to create?</h2>
          <p>Choose between sharing a quick post or a detailed recipe</p>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {/* Casual Post Option */}
          <button
            className="post-option casual-post-option"
            onClick={handleCasualPost}
          >
            <div className="option-icon">💬</div>
            <div className="option-content">
              <h3>Casual Post</h3>
              <p>Share a quick thought, photo, or baking moment with the community</p>
              <ul className="option-features">
                <li>Quick and easy</li>
                <li>Text only (Phase 3)</li>
                <li>Appears in feed</li>
              </ul>
            </div>
            <div className="option-arrow">→</div>
          </button>

          {/* Recipe Option */}
          <button
            className="post-option recipe-option"
            onClick={handleRecipe}
          >
            <div className="option-icon">📖</div>
            <div className="option-content">
              <h3>Detailed Recipe</h3>
              <p>Share a professional baking recipe with ingredients and steps</p>
              <ul className="option-features">
                <li>Ingredients list</li>
                <li>Step-by-step guide</li>
                <li>Baking tips</li>
                <li>Appears in Recipes</li>
              </ul>
            </div>
            <div className="option-arrow">→</div>
          </button>
        </div>

        {/* Modal Footer - Tips */}
        <div className="modal-footer">
          <p className="footer-tip">
            <strong>💡 Tip:</strong> Recipes are searchable, filterable, and more discoverable than casual posts. Use recipes for professional content you want to be found easily!
          </p>
        </div>
      </div>
    </div>
  );
}
