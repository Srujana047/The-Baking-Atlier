import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

export default function AdminRoute({ children }) {
  const { bootstrapping, isAuthenticated, user } = useAuth();

  if (bootstrapping) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner message="Loading admin workspace…" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/unauthorized" replace />;

  return children;
}

// TODO: add real admin pages + server-side role gates on admin endpoints

