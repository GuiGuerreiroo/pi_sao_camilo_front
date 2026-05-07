import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

/** Shape returned by the `/refresh-token` endpoint. */
interface IRefreshTokenResponse {
  id_token: string;
  refresh_token: string;
}

/** Extended config so we can flag a retry to avoid infinite loops. */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ─────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_MSS_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─────────────────────────────────────────────────────────────
// Request interceptor — attach idToken
// ─────────────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const idToken = localStorage.getItem(TOKEN_KEY);
    if (idToken && config.headers) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─────────────────────────────────────────────────────────────
// Response interceptor — handle 401 + refresh
// ─────────────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // Only attempt refresh once per request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        // Call the refresh endpoint using a plain axios call (NOT apiClient)
        // to avoid triggering our own interceptors recursively.
        const { data } = await axios.post<IRefreshTokenResponse>(
          `${import.meta.env.VITE_MSS_API_URL}/refresh-token`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        // Persist new tokens
        localStorage.setItem(TOKEN_KEY, data.id_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);

        // Retry the original request with the fresh token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.id_token}`;
        }
        return apiClient(originalRequest as AxiosRequestConfig);
      } catch {
        // Refresh failed — force logout
        clearAuthAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function clearAuthAndRedirect(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('user');
  window.location.href = '/';
}
