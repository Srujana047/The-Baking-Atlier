import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>404</h1>
          <p className="muted">That page doesn’t exist (yet).</p>
          <Link className="btn btn-solid" to="/">
            Back to Home
          </Link>
          {/* TODO: add bakery-themed illustration */}
        </div>
      </div>
    </div>
  );
}

