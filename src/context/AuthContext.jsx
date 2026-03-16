import { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken, setAuthFailureHandler } from '../services/api';
import { authApi } from '../controllers';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Register the failure handler so the interceptor can clear React state
  // and navigate via React Router instead of doing a hard window.location redirect.
  useEffect(() => {
    setAuthFailureHandler(() => {
      setAccessToken(null);
      setUser(null);
      navigate('/sign-in', { replace: true });
    });
  }, [navigate]);

  // On mount: silently restore session via httpOnly refresh-token cookie.
  // If the cookie is missing or expired the call rejects and the user stays
  // unauthenticated — no localStorage reads needed.
  useEffect(() => {
    authApi.refreshToken()
      .then(data => {
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email, password, role) => {
    const data = await authApi.login(email, password, role);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // swallow — always clear local state
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
