import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or error
api.interceptors.response.use(
  (response) => {
    // If backend returns ApiResponse envelope, return its data or payload
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token if expired
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // localStorage.removeItem('learnhub_token');
        // localStorage.removeItem('learnhub_user');
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
