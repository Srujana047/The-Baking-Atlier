import { useState, useEffect } from "react";
import { createHttpClient } from "../../api/http";
import { createCommentApi } from "../../api/commentApi";
import { useAuth } from "../../context/AuthContext";
import ReportButton from "./ReportButton";
import "./CommentSection.css";

/**
 * CommentSection Component
 * Displays and manages comments for a post
 * 
 * Props:
 * - postId: string - ID of the post
 * - commentsCount: number - total number of comments
 * - onCommentAdded: function - callback when new comment is added
 * - onLoadingChange: function - callback to update loading state
 * - isLoading: boolean - whether data is loading
 */
export default function CommentSection({
  postId,
  commentsCount,
  onCommentAdded,
  onLoadingChange,
  isLoading
}) {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const http = createHttpClient({ getToken: () => token });
  const commentApi = createCommentApi(http);

  // Load comments when component mounts
  useEffect(() => {
    loadComments();
    onLoadingChange?.(true);
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const { comments: fetchedComments } = await commentApi.getByPost(postId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error("Failed to load comments:", error);
      // TODO: show error toast notification
    } finally {
      setLoadingComments(false);
      onLoadingChange?.(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newCommentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await commentApi.create(postId, newCommentText);
      
      // Add new comment to list
      setComments([...comments, result.comment]);
      setNewCommentText("");
      onCommentAdded?.(result.comment);

      // TODO: scroll to new comment
      // TODO: show success toast notification
    } catch (error) {
      console.error("Failed to add comment:", error);
      // TODO: show error toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await commentApi.delete(commentId);
      setComments(comments.filter((c) => c.id !== commentId && c._id !== commentId));
      // TODO: show success toast
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // TODO: show error toast
    }
  };

  const formatCommentTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMs / 3600000)}h ago`;
  };

  return (
    <div className="comment-section">
      {/* Comment Input Form */}
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          disabled={isSubmitting}
          maxLength={500}
        />
        <button
          type="submit"
          className="btn btn-primary comment-submit"
          disabled={isSubmitting || !newCommentText.trim()}
        >
          {isSubmitting ? "..." : "Post"}
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {loadingComments ? (
          <p className="muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="muted">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id || comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <span className="comment-avatar">👤</span>
                  <div className="comment-meta">
                    <strong>{comment.authorName}</strong>
                    <span className="comment-time">
                      {formatCommentTime(comment.createdAt)}
                    </span>
                  </div>
                </div>

                {/* TODO: add edit comment option */}
                {/* TODO: add like comment functionality */}

                <ReportButton
                  contentType="comment"
                  contentId={comment._id || comment.id}
                  onReport={async (reportData) => {
                    // Report is handled by parent, just close this
                    console.log("Report submitted for comment:", reportData);
                  }}
                />
              </div>

              <p className="comment-text">{comment.text}</p>

              {/* TODO: add nested replies */}
              {/* <button className="reply-btn">Reply</button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
