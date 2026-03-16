import axios from 'axios';
import { BASE_URL, AUTH_PATHS } from '../constants/apiUrlConstant';

// ── In-memory access token ────────────────────────────────────────────────────
// Kept in a module-level variable so it survives re-renders but is invisible
// to XSS (unlike localStorage). Updated by AuthContext after login / refresh.
let _accessToken = null;
let _isRefreshing = false;
let _refreshQueue = []; // { resolve, reject }[] — requests queued during refresh

export function setAccessToken(token) { _accessToken = token; }
export function getAccessToken() { return _accessToken; }

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send / receive httpOnly cookies on every request
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────
api.interceptors.request.use(config => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// ── Response interceptor: unwrap data + silent refresh on 401 ────────────────
api.interceptors.response.use(
  res => res.data,

  async err => {
    const orig = err.config;
    const is401 = err.response?.status === 401;
    const isAuthEndpoint =
      orig.url?.includes(AUTH_PATHS.REFRESH_TOKEN) ||
      orig.url?.includes(AUTH_PATHS.SUPERADMIN_LOGIN) ||
      orig.url?.includes(AUTH_PATHS.COLLEGEADMIN_LOGIN);

    if (is401 && !orig._retry && !isAuthEndpoint) {
      // ── Queue subsequent 401s while a refresh is in-flight ──────────────
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _refreshQueue.push({ resolve, reject });
        }).then(token => {
          orig.headers.Authorization = `Bearer ${token}`;
          return api(orig);
        });
      }

      orig._retry = true;
      _isRefreshing = true;

      try {
        // Use raw axios so this call doesn't go through our interceptor again
        const { data } = await axios.post(
          `${BASE_URL}${AUTH_PATHS.REFRESH_TOKEN}`,
          {},
          { withCredentials: true },
        );

        _accessToken = data.accessToken;
        _refreshQueue.forEach(p => p.resolve(_accessToken));
        _refreshQueue = [];

        orig.headers.Authorization = `Bearer ${_accessToken}`;
        return api(orig); // retry original request
      } catch (refreshErr) {
        _accessToken = null;
        _refreshQueue.forEach(p => p.reject(refreshErr));
        _refreshQueue = [];
        window.location.href = '/sign-in';
        return Promise.reject(refreshErr);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);

export default api;
