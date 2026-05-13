import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createHttpClient } from "../api/http";
import { createAuthApi } from "../api/authApi";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

const STORAGE_KEY = "tba_auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.get(STORAGE_KEY)?.token || "");
  const [user, setUser] = useState(() => storage.get(STORAGE_KEY)?.user || null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState(null);

  const http = useMemo(() => createHttpClient({ getToken: () => token }), [token]);
  const authApi = useMemo(() => createAuthApi(http), [http]);

  // Persist session
  useEffect(() => {
    storage.set(STORAGE_KEY, { token, user });
  }, [token, user]);

  // Bootstrap: if we have a token, try to load /me for a fresh user object.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        if (!token) return;
        const data = await authApi.me();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) {
          setToken("");
          setUser(null);
        }
      }
    }

    Promise.resolve(bootstrap()).finally(() => {
      if (!cancelled) setBootstrapping(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signup(payload) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.signup(payload);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Signup failed";
      setError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(payload);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
    storage.remove(STORAGE_KEY);
  }

  const value = useMemo(() => {
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      loading,
      bootstrapping,
      error,
      signup,
      login,
      logout
    };
  }, [token, user, loading, bootstrapping, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// TODO: refresh tokens + httpOnly cookie strategy for higher security in production

