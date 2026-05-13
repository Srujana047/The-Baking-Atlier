import { useAuth } from "../context/AuthContext.jsx";

function Panel({ title, children }) {
  return (
    <div className="card panel">
      <div className="panel-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <div className="dash-head">
          <h1>Dashboard</h1>
          <p className="muted">
            Welcome, {user?.name || "Baker"}! This is the Phase 1 layout foundation.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Left sidebar */}
          <aside className="dash-col">
            <Panel title="Your kitchen">
              <ul className="list">
                <li>Profile (TODO)</li>
                <li>Saved recipes (TODO)</li>
                <li>Following (TODO)</li>
              </ul>
              {/* TODO: add profile page and editable settings */}
            </Panel>

            <Panel title="Quick actions">
              <button className="btn btn-outline" type="button" disabled>
                Create post (TODO)
              </button>
              <button className="btn btn-outline" type="button" disabled>
                Share recipe (TODO)
              </button>
              {/* TODO: enable buttons after posts/recipes systems exist */}
            </Panel>
          </aside>

          {/* Center feed area */}
          <section className="dash-col dash-center">
            <Panel title="Community feed (placeholder)">
              <div className="placeholder">
                <p className="muted">
                  TODO: build posts feed (create/read), comments, likes, and filters.
                </p>
                <div className="placeholder-line" />
                <div className="placeholder-line" />
                <div className="placeholder-line short" />
              </div>
            </Panel>

            <Panel title="Trending (placeholder)">
              <p className="muted">
                TODO: show trending tags, top bakers, and featured recipes.
              </p>
            </Panel>
          </section>

          {/* Right recommendation sidebar */}
          <aside className="dash-col">
            <Panel title="Recommendations (placeholder)">
              <ul className="list">
                <li>Try: Brioche basics (TODO)</li>
                <li>Follow: PastryPro (TODO)</li>
                <li>Join: Weekend Bake-along (TODO)</li>
              </ul>
              {/* TODO: wire to real data */}
            </Panel>

            <Panel title="Role">
              <p className="muted">
                Your role is <strong>{user?.role || "user"}</strong>.
              </p>
              <p className="muted small">
                TODO: add admin-only views and moderation tools in later phases.
              </p>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

