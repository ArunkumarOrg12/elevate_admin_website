import axios from 'axios';
import { AUTH_URLS } from '../constants/apiUrlConstant';

let _accessToken = null;
let _refreshPromise = null;

export function setAccessToken(token) { _accessToken = token; }
export function getAccessToken() { return _accessToken; }

const api = axios.create({ withCredentials: true });

api.interceptors.request.use(config => {
  if (_accessToken) config.headers.Authorization = `Bearer ${_accessToken}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!_refreshPromise) {
        _refreshPromise = axios.post(AUTH_URLS.REFRESH_TOKEN, {}, { withCredentials: true })
          .then(r => { _accessToken = r.data.accessToken; })
          .catch(() => { _accessToken = null; window.location.href = '/sign-in'; })
          .finally(() => { _refreshPromise = null; });
      }
      await _refreshPromise;
      if (_accessToken) {
        original.headers.Authorization = `Bearer ${_accessToken}`;
        return api(original);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
