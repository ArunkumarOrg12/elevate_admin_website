import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const settingsApi = {
  get: () =>
    api.get(ADMIN_PATHS.SETTINGS),

  getGeneral: () =>
    api.get(`${ADMIN_PATHS.SETTINGS}/general`),

  updateGeneral: (data) =>
    api.put(`${ADMIN_PATHS.SETTINGS}/general`, data),

  getProfile: () =>
    api.get(`${ADMIN_PATHS.SETTINGS}/profile`),

  updateProfile: (data) =>
    api.put(`${ADMIN_PATHS.SETTINGS}/profile`, data),

  update: (data) =>
    api.put(ADMIN_PATHS.SETTINGS, data),

  updatePassword: (data) =>
    api.put(`${ADMIN_PATHS.SETTINGS}/password`, data),

  updateNotifications: (data) =>
    api.put(`${ADMIN_PATHS.SETTINGS}/notifications`, data),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS,
    queryFn: settingsApi.get,
  });
}

export function useGeneralSettings() {
  return useQuery({
    queryKey: [...QUERY_KEYS.SETTINGS, 'general'],
    queryFn: settingsApi.getGeneral,
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateGeneral,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.SETTINGS, 'general'] }),
  });
}

export function useProfileSettings() {
  return useQuery({
    queryKey: [...QUERY_KEYS.SETTINGS, 'profile'],
    queryFn: settingsApi.getProfile,
  });
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.SETTINGS, 'profile'] }),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS }),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: settingsApi.updatePassword,
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS }),
  });
}


export default settingsApi;
