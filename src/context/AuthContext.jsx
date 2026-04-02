import { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { setAuthToken } from "../services/api";
import api from "../services/api";
import { BASE_URL, AUTH_URLS } from "../constants/apiUrlConstant";
import { ROLES } from "../constants/roles";

export const AuthContext = createContext(null);

// Non-sensitive user info persisted across page reloads.
// Actual tokens are NEVER stored here — they live in httpOnly cookies
// (refreshToken) and an in-memory variable (accessToken).
const USER_KEY = "employiq_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  // true while we attempt a silent session restore on first mount
  const [loading, setLoading] = useState(true);

  // ── Silent session restore ─────────────────────────────────────────────────
  // On every cold load, try to exchange the httpOnly refreshToken cookie for a
  // fresh accessToken. If it fails (cookie expired / missing), the user is
  // considered logged-out.
  useEffect(() => {
    const tryRestore = async () => {
      if (!loadStoredUser()) {
        // No cached user — nothing to restore.
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.post(
          `${BASE_URL}${AUTH_URLS.REFRESH_TOKEN}`,
          {},
          { withCredentials: true },
        );
        setAuthToken(data.accessToken);
      } catch {
        // Refresh failed — session is truly expired.
        setAuthToken(null);
        setUser(null);
        try {
          localStorage.removeItem(USER_KEY);
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    tryRestore();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  // role: 'superadmin' | 'collegeadmin' | 'college_faculty'
  const login = useCallback(async (email, password, role = "superadmin") => {
    const loginUrl =
      role === ROLES.COLLEGE_ADMIN || role === ROLES.COLLEGE_FACULTY
        ? AUTH_URLS.COLLEGEADMIN_LOGIN
        : AUTH_URLS.SUPERADMIN_LOGIN;
    // api.post goes through the interceptor → returns res.data directly
    const res = await api.post(loginUrl, { email, password });
    setAuthToken(res.accessToken);
    setUser(res.user);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    } catch {}
    return res;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post(AUTH_URLS.LOGOUT);
    } catch {}
    setAuthToken(null);
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
