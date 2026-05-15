import { useState } from "react";
import LikeButton from "./LikeButton";
import ReportButton from "./ReportButton";
import CommentSection from "./CommentSection";
import "./PostCard.css";

/**
 * PostCard Component
 * Displays a single casual baking post with engagement features
 * 
 * Props:
 * - post: object - post data including id, caption, author, likes, comments
 * - currentUserId: string - ID of current logged-in user
 * - onLike: function - callback to handle like action
 * - onUnlike: function - callback to handle unlike action
 * - onComment: function - callback to handle new comment
 * - onReport: function - callback to handle report submission
 * - onDeletePost: function - callback to delete post
 */
export default function PostCard({
  post,
  currentUserId,
  onLike,
  onUnlike,
  onComment,
  onReport,
  onDeletePost
}) {
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((like) => like.userId === currentUserId) || false
  );
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const isAuthor = post.authorId === currentUserId;

  // Format timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // TODO: improve date formatting for older posts
    return date.toLocaleDateString();
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      await onLike(post.id || post._id);
      setIsLiked(true);
    } catch (error) {
      console.error("Failed to like post:", error);
      throw error;
    }
  };

  const handleUnlike = async () => {
    try {
      await onUnlike(post.id || post._id);
      setIsLiked(false);
    } catch (error) {
      console.error("Failed to unlike post:", error);
      throw error;
    }
  };

  // TODO: add image display with placeholder
  // TODO: add post editing capability
  // TODO: add share functionality

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="avatar-placeholder">👤</div>
          <div className="author-info">
            <h3 className="author-name">{post.authorName}</h3>
            <p className="post-time">{formatTime(post.createdAt)}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="post-menu">
            <button
              className="menu-btn"
              onClick={() => onDeletePost(post.id || post._id)}
              title="Delete post"
            >
              🗑️
            </button>
            {/* TODO: add edit post option */}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p className="post-caption">{post.caption}</p>

        {/* TODO: display image if exists */}
        {/* {post.imageUrl && (
          <img src={post.imageUrl} alt={post.imageAlt} className="post-image" />
        )} */}
      </div>

      {/* Post Engagement Stats */}
      <div className="post-stats">
        <span className="stat">
          {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
        </span>
        <span className="stat">
          {post.commentsCount || 0} {post.commentsCount === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <LikeButton
          isLiked={isLiked}
          likesCount={post.likesCount || 0}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />

        <button
          className="action-btn"
          onClick={handleToggleComments}
          title="View comments"
          aria-label="Toggle comments section"
        >
          💬 <span className="action-count">{post.commentsCount || 0}</span>
        </button>

        <ReportButton
          contentType="post"
          contentId={post.id || post._id}
          onReport={onReport}
        />
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id || post._id}
          commentsCount={post.commentsCount || 0}
          onCommentAdded={onComment}
          isLoading={commentsLoading}
          onLoadingChange={setCommentsLoading}
        />
      )}
    </div>
  );
}
