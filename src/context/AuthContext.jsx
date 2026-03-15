import { createContext, useState, useCallback, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { setAccessToken } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ei_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
        setAccessToken(parsed.token);
      } catch {
        localStorage.removeItem('ei_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password, role) => {
    // Mock auth — in production this calls authController
    await new Promise(r => setTimeout(r, 800));
    const mockUser = MOCK_USERS[role];
    if (!mockUser) throw new Error('Invalid role');
    const token = 'mock-token-' + Date.now();
    setUser(mockUser);
    setToken(token);
    setAccessToken(token);
    localStorage.setItem('ei_user', JSON.stringify({ user: mockUser, token }));
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
    localStorage.removeItem('ei_user');
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
