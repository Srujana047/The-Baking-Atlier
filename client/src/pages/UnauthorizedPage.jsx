import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ padding: "36px", textAlign: "center" }}>
          <h1>Unauthorized</h1>
          <p className="muted">
            You must have admin privileges to access this page.
          </p>
          <p>
            Return to your <Link to="/dashboard">dashboard</Link> or contact a site administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
