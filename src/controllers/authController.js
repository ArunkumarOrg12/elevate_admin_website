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
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password, role }) => authApi.login(email, password, role),
    onSuccess: (data) => setAuthToken(data.accessToken),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => setAuthToken(null),
  });
}

export default authApi;
