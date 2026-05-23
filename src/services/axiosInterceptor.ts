import axios from 'axios';
import { refreshToken } from '../app/api/user/refreshToken';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export function setupGlobalAxiosInterceptor() {
  // PROACTIVE REQUEST INTERCEPTOR (BYPASSES CORS BUG)
  axios.interceptors.request.use(
    async (config) => {
      // Prevent intercepting the refresh call itself to avoid infinite loops
      if (config.url?.includes('refresh-token')) {
        return config;
      }

      let token = localStorage.getItem('token');
      if (token) {
        const decoded = parseJwt(token);
        // Check if token has an expiration
        if (decoded && decoded.exp) {
          const currentTime = Date.now() / 1000;
          // If token expires in less than 15 seconds (or is already expired)
          if (decoded.exp < currentTime + 15) {
            const localRefreshToken = localStorage.getItem('refresh_token');
            if (localRefreshToken) {
              if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshToken(localRefreshToken).finally(() => {
                  isRefreshing = false;
                  refreshPromise = null;
                });
              }

              if (refreshPromise) {
                try {
                  // Pause this request until the refresh is complete
                  await refreshPromise;
                  token = localStorage.getItem('token');
                  
                  // Now that we have a fresh token, update the authorization header
                  if (token && config.headers && config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                  }
                } catch (error) {
                  // Refresh failed, kick user to login
                  localStorage.removeItem('token');
                  localStorage.removeItem('refresh_token');
                  window.location.href = '/';
                  return Promise.reject(error);
                }
              }
            } else {
               // Token expiring and no refresh token available
               localStorage.removeItem('token');
               window.location.href = '/';
            }
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}
