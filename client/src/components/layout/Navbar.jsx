import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            🍞
          </span>
          <span className="brand-text">The Baking Atlier</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
            Recipes
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
            Contact
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
                Dashboard
              </NavLink>
              {user?.role === "admin" ? (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
                  Admin
                </NavLink>
              ) : null}
            </>
          ) : null}
        </nav>

        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={toggleTheme} type="button">
            {theme === "light" ? <FaMoon size={20} color="gray" /> : <FaSun size={20} color="orange" />}
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
              <Link className="btn btn-ghost" to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link className="btn btn-solid" to="/signup" onClick={closeMenu}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

