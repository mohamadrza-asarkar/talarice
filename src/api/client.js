import axios from 'axios';

// Base API client configured for backend requests
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach bearer token and dynamic baseURL if customized
client.interceptors.request.use(
  function (config) {
    const customUrl = localStorage.getItem('tala_api_url');
    if (customUrl) {
      config.baseURL = customUrl.trim();
    }
    const token = localStorage.getItem('tala_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor to parse response & handle auth errors
client.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tala_token');
      localStorage.removeItem('token');
      localStorage.removeItem('tala_auth');
    }
    const parsedError = error.response?.data || {
      success: false,
      message: error.message || 'خطای ارتباط با سرور'
    };
    return Promise.reject(parsedError);
  }
);

export default client;
