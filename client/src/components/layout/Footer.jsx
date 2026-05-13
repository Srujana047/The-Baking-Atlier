import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">
            <span aria-hidden="true">🥐</span> The Baking Atlier
          </div>
          <p className="muted small">
            A cozy community for bakers to learn, share, and celebrate.
          </p>
          {/* TODO: add newsletter signup once backend email service exists */}
        </div>

        <div className="footer-links">
          <div>
            <div className="footer-title">Quick links</div>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            {/* TODO: add About/Contact pages */}
          </div>

          <div>
            <div className="footer-title">Social</div>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Instagram (placeholder)
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              YouTube (placeholder)
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Discord (placeholder)
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom muted small">
        © {new Date().getFullYear()} The Baking Atlier. All rights reserved.
      </div>
    </footer>
  );
}

