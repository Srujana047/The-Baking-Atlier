import { useState } from "react";
import "./LikeButton.css";

/**
 * LikeButton Component
 * Handles post liking/unliking with dynamic UI feedback
 * 
 * Props:
 * - isLiked: boolean - whether current user has liked this post
 * - likesCount: number - total number of likes
 * - onLike: function - callback when like is clicked
 * - onUnlike: function - callback when unlike is clicked
 * - isLoading: boolean - show loading state during API call
 */
export default function LikeButton({
  isLiked,
  likesCount,
  onLike,
  onUnlike,
  isLoading = false
}) {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likesCount);

  const handleClick = async () => {
    if (isLoading) return;

    // Optimistic update for immediate UI feedback
    const wasLiked = optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticCount((count) =>
      wasLiked ? count - 1 : count + 1
    );

    try {
      if (wasLiked) {
        await onUnlike();
      } else {
        await onLike();
      }
    } catch (error) {
      // Revert on error
      setOptimisticLiked(wasLiked);
      setOptimisticCount(likesCount);
      console.error("Failed to update like:", error);
      // TODO: show error toast notification (Phase 2+)
    }
  };

  return (
    <button
      className={`like-btn ${optimisticLiked ? "liked" : ""} ${isLoading ? "loading" : ""}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={optimisticLiked ? "Unlike post" : "Like post"}
      title={`${optimisticCount} ${optimisticCount === 1 ? "like" : "likes"}`}
    >
      <span className="like-icon">❤️</span>
      <span className="like-count">{optimisticCount}</span>
    </button>
  );
}
