import { useState, useEffect } from "react";
import { createHttpClient } from "../../api/http";
import { createPostApi } from "../../api/postApi";
import { createReportApi } from "../../api/reportApi";
import { useAuth } from "../../context/AuthContext";
import PostCard from "./PostCard";
import "./Feed.css";

/**
 * Feed Component
 * Displays the community feed with posts in reverse chronological order
 * Includes pagination/infinite scroll capability
 * 
 * Props:
 * - refreshTrigger: number - increment to trigger feed refresh
 */
export default function Feed({ refreshTrigger }) {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const http = createHttpClient({ getToken: () => token });
  const postApi = createPostApi(http);
  const reportApi = createReportApi(http);

  // TODO: implement infinite scrolling
  // TODO: implement feed caching for performance
  // TODO: implement real-time updates with WebSocket

  const POSTS_PER_PAGE = 10;

  // Load posts on mount or when refresh is triggered
  useEffect(() => {
    loadPosts(0);
  }, [refreshTrigger]);

  const loadPosts = async (skipValue = 0) => {
    try {
      setIsLoading(skipValue === 0);
      setError(null);

      const { posts: fetchedPosts, pagination } = await postApi.getAll(
        skipValue,
        POSTS_PER_PAGE
      );

      if (skipValue === 0) {
        setPosts(fetchedPosts || []);
      } else {
        setPosts((prev) => [...prev, ...fetchedPosts]);
      }

      setHasMore(pagination.hasMore);
      setSkip(skipValue + POSTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts. Please try again.");
      // TODO: show error toast notification
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await loadPosts(skip);
  };

  const handleLike = async (postId) => {
    await postApi.like(postId);
    // Update post in local state
    setPosts(
      posts.map((p) =>
        (p._id === postId || p.id === postId)
          ? { ...p, likesCount: p.likesCount + 1 }
          : p
      )
    );
  };

  const handleUnlike = async (postId) => {
    await postApi.unlike(postId);
    // Update post in local state
    setPosts(
      posts.map((p) =>
        (p._id === postId || p.id === postId)
          ? { ...p, likesCount: Math.max(0, p.likesCount - 1) }
          : p
      )
    );
  };

  const handleCommentAdded = (newComment) => {
    // Update post comment count
    setPosts(
      posts.map((p) =>
        p._id === newComment.postId || p.id === newComment.postId
          ? { ...p, commentsCount: p.commentsCount + 1 }
          : p
      )
    );
  };

  const handleReport = async (reportData) => {
    await reportApi.create(
      reportData.reportedType,
      reportData.reportedId,
      reportData.reason
    );
    // TODO: show success toast
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      await postApi.delete(postId);
      setPosts(posts.filter((p) => p._id !== postId && p.id !== postId));
      // TODO: show success toast
    } catch (err) {
      console.error("Failed to delete post:", err);
      // TODO: show error toast
    }
  };

  if (isLoading) {
    return (
      <section className="feed-container">
        <div className="loading-state">
          <p>Loading posts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="feed-container">
        <div className="error-state">
          <p>{error}</p>
          <button
            className="btn btn-outline"
            onClick={() => loadPosts(0)}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="feed-container">
      {posts.length === 0 ? (
        <div className="empty-feed">
          <p className="empty-message">No posts yet.</p>
          <p className="muted">Be the first to share your baking journey!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              currentUserId={user?.id}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onComment={handleCommentAdded}
              onReport={handleReport}
              onDeletePost={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* Load more button - TODO: replace with infinite scroll */}
      {hasMore && (
        <div className="load-more-section">
          <button
            className="btn btn-outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}
    </section>
  );
}
