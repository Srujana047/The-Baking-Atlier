import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { bootstrapping, isAuthenticated, user } = useAuth();

  if (bootstrapping) {
    return (
      <div className="page">
        <div className="container">
          <p className="muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}

// TODO: add real admin pages + server-side role gates on admin endpoints

