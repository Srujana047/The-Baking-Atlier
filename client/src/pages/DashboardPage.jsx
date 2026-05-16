import { useState } from "react";
import { createHttpClient } from "../api/http";
import { createPostApi } from "../api/postApi";
import { useAuth } from "../context/AuthContext.jsx";
import CreatePostForm from "../components/feed/CreatePostForm";
import CreatePostModal from "../components/feed/CreatePostModal.jsx";
import Feed from "../components/feed/Feed";
import UserRecommendations from "../components/feed/UserRecommendations";

function Panel({ title, children }) {
  return (
    <div className="card panel">
      <div className="panel-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedRefreshTrigger, setFeedRefreshTrigger] = useState(0);

  const http = createHttpClient({ getToken: () => token });
  const postApi = createPostApi(http);

  const handleCreatePost = async (postData) => {
    try {
      await postApi.create(postData.caption);
      setShowCreatePostForm(false);
      // Trigger feed refresh
      setFeedRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dash-head">
          <h1>Dashboard</h1>
          <p className="muted">
            Welcome, {user?.name || "Baker"}! Share your baking journey with the community.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Left sidebar */}
          <aside className="dash-col">
            <Panel title="Your kitchen">
              <ul className="list">
                <li>Profile (TODO - Phase 3)</li>
                <li>Saved recipes (TODO - Phase 3)</li>
                <li>Following (TODO - Phase 3)</li>
              </ul>
            </Panel>

            <Panel title="Quick actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowCreateModal(true)}
              >
                + Create
              </button>

              {/* TODO: Phase 3+ - add quick recipe draft feature */}
              {/* <button className="btn btn-outline" type="button">
                📖 Recipe Drafts
              </button> */}
            </Panel>

            <Panel title="Your role">
              <p className="muted">
                You're logged in as <strong>{user?.role || "user"}</strong>.
              </p>
              {/* TODO: add admin-only views in Phase 3+ */}
            </Panel>
          </aside>

          {/* Center feed area */}
          <section className="dash-col dash-center">
            {/* Create Post/Recipe Modal */}
            <CreatePostModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
            />

            {/* Create Post Form */}
            {showCreatePostForm && (
              <Panel title="Create a Post">
                <CreatePostForm
                  userName={user?.name || "Baker"}
                  onPostCreated={handleCreatePost}
                  onCancel={() => setShowCreatePostForm(false)}
                />
              </Panel>
            )}

            {/* Community Feed */}
            <Panel title="Community Feed">
              <Feed refreshTrigger={feedRefreshTrigger} />
            </Panel>

            {/* TODO: Trending section for Phase 3 */}
            {/* <Panel title="Trending">
              <p className="muted">
                Trending tags, top bakers, and featured recipes coming soon!
              </p>
            </Panel> */}
          </section>

          {/* Right recommendation sidebar */}
          <aside className="dash-col">
            <UserRecommendations
              onUserSelect={(userId) => {
                // TODO: navigate to user profile (Phase 3)
                console.log("View profile:", userId);
              }}
            />

            {/* TODO: Add search foundation in Phase 2+ */}
            {/* <Panel title="Search">
              <input
                type="text"
                placeholder="Search posts, users..."
                className="input"
              />
            </Panel> */}
          </aside>
        </div>
      </div>
    </div>
  );
}

