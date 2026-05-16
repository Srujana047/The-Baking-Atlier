import { useState, useRef } from "react";
import "./CreatePostForm.css";

/**
 * CreatePostForm Component
 * Lightweight form for users to create casual baking posts
 * Appears as a modal/card on the dashboard
 * 
 * Props:
 * - onPostCreated: function - callback when post is successfully created
 * - onCancel: function - callback when user cancels post creation
 * - userName: string - name of the current user
 */
export default function CreatePostForm({
  onPostCreated,
  onCancel,
  userName = "Baker"
}) {
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // TODO: implement image upload functionality (Phase 3)
  // const [images, setImages] = useState([]);
  // const [previewUrls, setPreviewUrls] = useState([]);

  // Auto-expand textarea as user types
  const handleTextareaChange = (e) => {
    setCaption(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      setError("Please write something to share!");
      return;
    }

    if (caption.length > 2000) {
      setError("Post is too long (max 2000 characters)");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onPostCreated({
        caption: caption.trim()
        // TODO: add image data when implemented
        // images,
      });

      // Clear form on success
      setCaption("");
      // TODO: show success toast notification
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: implement image upload handler
   const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
     // validate and preview images  
  }

  return (
    <div className="create-post-form">
      <div className="form-header">
        <div className="user-section">
          <span className="avatar-placeholder">👤</span>
          <p className="user-name">{userName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Textarea for caption */}
        <textarea
          ref={textareaRef}
          className="post-textarea"
          placeholder="What's baking in your kitchen today?"
          value={caption}
          onChange={handleTextareaChange}
          disabled={isSubmitting}
          maxLength={2000}
          rows={3}
        />

        {/* Character counter */}
        <div className="char-count">
          {caption.length}/2000
        </div>

        {/* TODO: image upload button */}
        { <div className="form-toolbar">
          <button type="button" className="toolbar-btn" title="Add image">
            📷
          </button>
        </div> }

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Form actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !caption.trim()}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
