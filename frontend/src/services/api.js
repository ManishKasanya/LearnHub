import axios from 'axios';

// Storage key for custom/override API URL
const STORAGE_KEY = 'learnhub_api_url';

/**
 * Normalizes an API base URL ensuring proper scheme and '/api' suffix.
 * Handles cases like:
 * - "https://my-backend.onrender.com" -> "https://my-backend.onrender.com/api"
 * - "https://my-backend.onrender.com/api" -> "https://my-backend.onrender.com/api"
 * - "http://localhost:8080" -> "http://localhost:8080/api"
 * - "/api" -> "/api"
 */
export function normalizeApiUrl(url) {
  if (!url) return '';
  let trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return '';

  if (trimmed === '/api' || trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

/**
 * Resolves the active backend API base URL with priority:
 * 1. Runtime override in localStorage (allows users/testers to connect directly in deployed apps)
 * 2. Vite environment variable: import.meta.env.VITE_API_URL or VITE_API_BASE_URL
 * 3. Default fallback: '/api' (leverages Vite dev proxy locally or same-origin reverse proxy)
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEY);
    if (customUrl && customUrl.trim()) {
      return normalizeApiUrl(customUrl);
    }
  }

  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeApiUrl(envUrl);
  }

  return '/api';
}

/**
 * Returns the host root URL without '/api' (useful for resolving uploaded static assets like /uploads/...)
 */
export function getBackendHost() {
  const base = getApiBaseUrl();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base.replace(/\/api\/?$/, '');
  }
  return '';
}

/**
 * Resolves static media/asset URLs (e.g. /uploads/video.mp4 or /uploads/image.png)
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const host = getBackendHost();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return host ? `${host}${cleanPath}` : cleanPath;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Sets a new backend API URL at runtime and updates the Axios instance.
 */
export function setApiBaseUrl(url) {
  if (!url || !url.trim()) {
    return resetApiBaseUrl();
  }
  const normalized = normalizeApiUrl(url);
  localStorage.setItem(STORAGE_KEY, normalized);
  api.defaults.baseURL = normalized;
  return normalized;
}

/**
 * Resets the runtime backend API URL to default.
 */
export function resetApiBaseUrl() {
  localStorage.removeItem(STORAGE_KEY);
  const fallback = getApiBaseUrl();
  api.defaults.baseURL = fallback;
  return fallback;
}

/**
 * Tests connection to the backend health endpoint.
 */
export async function testBackendConnection(testUrl) {
  const targetBase = testUrl ? normalizeApiUrl(testUrl) : getApiBaseUrl();
  const startTime = Date.now();
  try {
    const healthUrl = `${targetBase}/health/ping`;
    const res = await axios.get(healthUrl, { timeout: 8000 });
    const latency = Date.now() - startTime;
    return {
      ok: true,
      latency,
      status: res.status,
      message: 'Backend server is online and responding!',
      data: res.data,
      url: targetBase,
    };
  } catch (err) {
    // Try fallback /health
    try {
      const res = await axios.get(`${targetBase}/health`, { timeout: 8000 });
      return {
        ok: true,
        latency: Date.now() - startTime,
        status: res.status,
        message: 'Backend server is online and healthy!',
        data: res.data,
        url: targetBase,
      };
    } catch (fallbackErr) {
      const latency = Date.now() - startTime;
      return {
        ok: false,
        latency,
        error: fallbackErr.message || err.message,
        code: fallbackErr.code || err.code,
        url: targetBase,
        message: fallbackErr.response
          ? `Server returned HTTP ${fallbackErr.response.status}`
          : 'Unable to reach backend server. Check URL and CORS configuration.',
      };
    }
  }
}

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('learnhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or error with informative messaging
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Token expired
      }
    }

    let message = error.response?.data?.message || error.response?.data?.error;
    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const currentUrl = api.defaults.baseURL || getApiBaseUrl();
        message = `Unable to connect to backend server (${currentUrl}). Please check your server connection or configure the server URL.`;
      } else if (error.response?.status === 404) {
        message = `API endpoint not found (404) at ${error.config?.url}. Please verify backend deployment.`;
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
