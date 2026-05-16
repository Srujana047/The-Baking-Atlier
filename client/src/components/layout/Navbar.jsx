import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import {FaSun, FaMoon} from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            🍞
          </span>
          <span className="brand-text">The Baking Atlier</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => (isActive ? "active" : "")}>
            Recipes
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          ) : null}

          {/* TODO: Phase 4 - add "Community" link */}
        </nav>

        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={toggleTheme} type="button">
            {theme === "light" ? <FaMoon size={20} color="gray" /> : <FaSun size={20} color='orange' />} 
          </button>

          {isAuthenticated ? (
            <>
              <span className="nav-user muted" title={user?.email || ""}>
                {user?.name || "Baker"}
                {user?.role === "admin" ? " (admin)" : ""}
              </span>
              <button className="btn btn-solid" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-solid" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* TODO: improve mobile responsiveness with a hamburger menu */}
    </header>
  );
}

