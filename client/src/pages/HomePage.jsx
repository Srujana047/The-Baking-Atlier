import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-value">{value}</div>
      <div className="muted">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="card feature-card">
      <div className="feature-title">{title}</div>
      <p className="muted">{description}</p>
      {/* TODO: add small icons + hover animations */}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      {/* SECTION 1 — HERO/WELCOME */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="pill">Freshly baked community vibes</div>
            <h1 className="hero-title">
              Welcome to <span className="accent">The Baking Atlier</span>
            </h1>
            <p className="hero-tagline">
              A warm space for bakers to connect, learn, and share inspiration—one loaf at a time.
            </p>

            <div className="hero-actions">
              {isAuthenticated ? (
                <Link className="btn btn-solid" to="/dashboard">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link className="btn btn-solid" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-outline" to="/signup">
                    Signup
                  </Link>
                  <Link className="btn btn-ghost" to="/signup">
                    Join Community
                  </Link>
                </>
              )}
            </div>

            <p className="muted small">
              TODO: add real community testimonials + photos once the posts system exists.
            </p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-card">
              <div className="visual-title">Today’s Bakery Board</div>
              <div className="visual-row">
                <span>🥖</span> Sourdough starters (placeholder)
              </div>
              <div className="visual-row">
                <span>🧁</span> Cupcake swirl tips (placeholder)
              </div>
              <div className="visual-row">
                <span>🍪</span> Cookie batch ideas (placeholder)
              </div>
              {/* TODO: replace with live highlights from the feed */}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — COMMUNITY OVERVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Community overview</h2>
            <p className="muted">A snapshot of the cozy kitchen we’re building together.</p>
          </div>

          <div className="grid stats-grid">
            <StatCard label="Active bakers" value="1,234 (placeholder)" />
            <StatCard label="Recipes shared" value="320 (TODO)" />
            <StatCard label="Weekly highlights" value="18 (placeholder)" />
          </div>

          <div className="grid features-grid">
            <FeatureCard
              title="Beginner-friendly"
              description="Simple flows, helpful UI, and a calm learning space."
            />
            <FeatureCard
              title="Bakery inspiration"
              description="Discover ideas for breads, cakes, cookies, and more."
            />
            <FeatureCard
              title="Community-first"
              description="Supportive feedback and positive baking energy."
            />
          </div>

          {/* TODO: add real stats from backend (Phase 2) */}
        </div>
      </section>

      {/* SECTION 3 — BAKING INSPIRATION */}
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>Baking inspiration</h2>
            <p className="muted">Featured ideas and trending highlights (placeholders for now).</p>
          </div>

          <div className="grid inspiration-grid">
            <div className="card inspiration-card">
              <div className="inspiration-badge">Featured recipe</div>
              <div className="inspiration-title">Cinnamon Roll Clouds</div>
              <p className="muted">
                Placeholder recipe teaser. TODO: connect to recipes collection and show real cards.
              </p>
            </div>
            <div className="card inspiration-card">
              <div className="inspiration-badge">Bakery showcase</div>
              <div className="inspiration-title">Weekend Pastry Tray</div>
              <p className="muted">
                Placeholder showcase. TODO: add community posts + image uploads.
              </p>
            </div>
            <div className="card inspiration-card">
              <div className="inspiration-badge">Trending</div>
              <div className="inspiration-title">Sourdough Starter Tips</div>
              <p className="muted">
                Placeholder highlight. TODO: build feed + tags + search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — OPTIONAL FUTURE SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Future section (TODO)</h2>
            <p className="muted">
              TODO: add events, bake-alongs, challenges, or featured creators.
            </p>
          </div>
          <div className="card">
            <p className="muted">
              Placeholder area for future expansion. Keep this section intentionally minimal in Phase 1.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

