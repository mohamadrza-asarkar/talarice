import axios from 'axios';

// Get base URL from environment or default to '/api'
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Attach Auth Bearer token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tala_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling & 401 handling
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ... } or just raw data
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tala_token');
      localStorage.removeItem('token');
      localStorage.removeItem('tala_auth');
      localStorage.removeItem('tala_user');
      // If unauthorized on protected route, redirect to profile/login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }

    const message = error.response?.data?.message || error.message || 'خطا در برقراری ارتباط با سرور';
    return Promise.reject({
      success: false,
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Helper methods
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  
  // Multipart upload helper
  upload: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {}),
      },
    });
  }
};

export default apiClient;
