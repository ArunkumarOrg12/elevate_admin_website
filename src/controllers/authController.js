import { useMutation } from '@tanstack/react-query';
import api, { setAuthToken } from '../services/api';
import { AUTH_URLS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const authApi = {
  login: (email, password, role) => {
    const path = role === 'superadmin'
      ? AUTH_URLS.SUPERADMIN_LOGIN
      : AUTH_URLS.COLLEGEADMIN_LOGIN;
    return api.post(path, { email, password });
  },

  logout: () =>
    api.post(AUTH_URLS.LOGOUT),

  refreshToken: () =>
    api.post(AUTH_URLS.REFRESH_TOKEN),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { setCurrentUser, clearCurrentUser } from '../store/authStore';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password, role }) => authApi.login(email, password, role),

    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setCurrentUser(data.user);  // ← save user object (has college_id, role, etc.)
    },

  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      setAccessToken(null);
      clearCurrentUser();  // ← clear on logout
    },

  });
}
