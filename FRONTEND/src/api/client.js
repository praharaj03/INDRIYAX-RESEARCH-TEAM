import axios from 'axios';

/**
 * Base URL resolution — works both locally and on Vercel.
 *
 *   - Local dev:   VITE_API_URL=http://localhost:5000  (from your .env)
 *   - Production:  VITE_API_URL=https://api.indriyax.com (set in Vercel)
 *
 * If VITE_API_URL is unset, we fall back to localhost so a fresh clone
 * still runs in dev without surprises.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: inject the Supabase access token on every call
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: unwrap the Standard Response Envelope on success,
// and normalize errors to a flat { message, errors, status } shape.
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data; // { success, message, data }
    }
    return response;
  },
  (error) => {
    const standardizedError = {
      message: 'A network error occurred. Please try again.',
      errors: [],
      status: error.response?.status || 500,
    };
    if (error.response?.data) {
      standardizedError.message = error.response.data.message || standardizedError.message;
      standardizedError.errors = error.response.data.errors || [];
    }
    return Promise.reject(standardizedError);
  }
);

export default apiClient;