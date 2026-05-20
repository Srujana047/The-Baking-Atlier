import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner message="Loading your session…" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

