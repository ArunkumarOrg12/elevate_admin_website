import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const settingsApi = {
  get: () =>
    api.get(ADMIN_PATHS.SETTINGS),

  update: (data) =>
    api.put(ADMIN_PATHS.SETTINGS, data),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS,
    queryFn: settingsApi.get,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS }),
  });
}


export default settingsApi;
