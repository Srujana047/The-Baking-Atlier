import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Input from "../components/ui/Input.jsx";

function validate(values) {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  else if (values.name.trim().length < 2) errors.name = "Name is too short";
  if (!values.email) errors.email = "Email is required";
  else if (!values.email.includes("@")) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 6) errors.password = "Use at least 6 characters";

  // TODO: add password confirmation + stronger rules + better UX (inline hints)
  return errors;
}

export default function SignupPage() {
  const { signup, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "" });
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

    const result = await signup(values);
    if (result.ok) navigate("/dashboard");
    else setFormError(result.message || "Signup failed");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-card card">
          <h1>Signup</h1>
          <p className="muted">Join the community and start sharing inspiration.</p>

          <form onSubmit={onSubmit} className="form">
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Your name"
              value={values.name}
              error={fieldErrors.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              autoComplete="name"
            />
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
              placeholder="At least 6 characters"
              value={values.password}
              error={fieldErrors.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              autoComplete="new-password"
            />

            {(formError || error) && <div className="alert">{formError || error}</div>}

            <button className="btn btn-solid" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>

            <p className="muted small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

