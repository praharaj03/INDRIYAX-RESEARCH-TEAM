import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT globally
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

// Response Interceptor: Unwrap global success/error response envelopes
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data; // Directly hands back unboxed { success, message, data }
    }
    return response;
  },
  (error) => {
    const standardizedError = {
      message: 'An absolute network anomaly occurred.',
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