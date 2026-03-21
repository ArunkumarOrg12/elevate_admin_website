import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { NOTIFICATION_API, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── Raw API functions ─────────────────────────────────────────────────────────
const notificationsApi = {
  // ── User-scoped ─────────────────────────────────────────────────────────────

  /** GET /inbox — paginated notifications for the logged-in user */
  getInbox: (params) =>
    api.get(NOTIFICATION_API.INBOX, { params }),

  /**
   * POST /broadcast
   * @param {Object} body
   * @param {'all'|'students'|'admins'|'specific'} body.target
   * @param {string[]} [body.userIds]   — required when target === 'specific'
   * @param {string}   body.title
   * @param {string}   body.message
   * @param {'email'|'in-app'|'both'} [body.channel='both']
   */
  broadcast: (body) =>
    api.post(NOTIFICATION_API.BROADCAST, body),

  /** PATCH /read-all */
  markAllRead: () =>
    api.patch(NOTIFICATION_API.READ_ALL),

  /** PATCH /:id/read */
  markOneRead: (id) =>
    api.patch(NOTIFICATION_API.READ_ONE(id)),

  /** DELETE / — wipe all notifications for the logged-in user only */
  deleteAll: () =>
    api.delete(NOTIFICATION_API.DELETE_ALL),

  /** DELETE /:id — delete one notification belonging to the logged-in user */
  deleteOne: (id) =>
    api.delete(NOTIFICATION_API.DELETE_ONE(id)),

  // ── Admin-scoped (cascade across ALL users) ──────────────────────────────────

  /** GET /broadcast — list all broadcasts sent (admin history view) */
  getBroadcastHistory: (params) =>
    api.get(NOTIFICATION_API.BROADCAST_HISTORY, { params }),

  /**
   * DELETE /broadcast/:id
   * Admin retracts one broadcast — backend must cascade-delete every
   * user_notification row referencing this broadcast_id.
   */
  adminDeleteBroadcast: (id) =>
    api.delete(NOTIFICATION_API.ADMIN_DELETE_ONE(id)),

  /**
   * DELETE /broadcast
   * Admin wipes ALL broadcast notifications from ALL users' inboxes globally.
   */
  adminDeleteAllBroadcasts: () =>
    api.delete(NOTIFICATION_API.ADMIN_DELETE_ALL),
};

// ── User hooks ────────────────────────────────────────────────────────────────

/** Fetch the logged-in user's notification inbox */
export function useNotificationInbox(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, 'inbox', params],
    queryFn: () => notificationsApi.getInbox(params),
    staleTime: 30_000,
  });
}

/** Broadcast a notification — invalidates inbox + history on success */
export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.broadcast,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

/** Mark ALL notifications as read */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

/** Mark a single notification as read */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.markOneRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

/** Delete ALL notifications for the logged-in user only */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.deleteAll,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

/** Delete a single notification for the logged-in user only */
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.deleteOne(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

// ── Admin hooks ───────────────────────────────────────────────────────────────

/** Fetch broadcast history sent by the admin */
export function useBroadcastHistory(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, 'broadcast-history', params],
    queryFn: () => notificationsApi.getBroadcastHistory(params),
    staleTime: 30_000,
  });
}

/**
 * Admin: retract a single broadcast from ALL users' inboxes.
 * Backend must cascade-delete every user_notification row for this broadcast_id.
 */
export function useAdminDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.adminDeleteBroadcast(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

/**
 * Admin: wipe ALL broadcasts from ALL users globally.
 */
export function useAdminDeleteAllBroadcasts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.adminDeleteAllBroadcasts,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS }),
  });
}

export default notificationsApi;
