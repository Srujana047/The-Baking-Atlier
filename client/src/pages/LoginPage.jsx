import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/ui/Input.jsx";

function validate(values) {
  const errors = {};
  if (!values.email) errors.email = "Email is required";
  else if (!values.email.includes("@")) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from || "/dashboard", [location.state]);

  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    const result = await login(values);
    if (result.ok) navigate(from);
    else setFormError(result.message || "Login failed");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-card card">
          <h1>Login</h1>
          <p className="muted">Welcome back. Let’s get you to the kitchen.</p>

          <form onSubmit={onSubmit} className="form">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              error={fieldErrors.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              error={fieldErrors.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              autoComplete="current-password"
            />

            {(formError || error) && <div className="alert">{formError || error}</div>}

            <button className="btn btn-solid" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>

            <p className="muted small">
              New here? <Link to="/signup">Create an account</Link>
            </p>

            {/* TODO: add "Forgot password" flow (backend + UI) */}
          </form>
        </div>
      </div>
    </div>
  );
}

