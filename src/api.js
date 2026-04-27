import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projectfsad-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach session user id if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.id) {
      config.headers['X-User-Id'] = user.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle all errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error?.response?.data) {
      const data = error.response.data;
      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object') {
        message = data.message || data.error || data.msg || JSON.stringify(data);
      }
    } else if (error?.message) {
      message = error.message;
    }

    // Session expired - only redirect if user was already logged in
    if (error?.response?.status === 401) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.id) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(String(message)));
  }
);

export default api;