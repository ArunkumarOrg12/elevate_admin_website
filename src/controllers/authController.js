import { useMutation } from '@tanstack/react-query';
import api, { setAccessToken } from '../services/api';
import { AUTH_PATHS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const authApi = {
  login: (email, password, role) => {
    const path = role === 'superadmin'
      ? AUTH_PATHS.SUPERADMIN_LOGIN
      : AUTH_PATHS.COLLEGEADMIN_LOGIN;
    return api.post(path, { email, password });
  },

  logout: () =>
    api.post(AUTH_PATHS.LOGOUT),

  refreshToken: () =>
    api.post(AUTH_PATHS.REFRESH_TOKEN),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password, role }) => authApi.login(email, password, role),
    onSuccess: (data) => setAccessToken(data.accessToken),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => setAccessToken(null),
  });
}

export default authApi;
