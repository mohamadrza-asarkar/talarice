import axios from 'axios';
import { parseApiError } from '../utils/errorHandler';

// Default backend Base URL from technical documentation
export const DEFAULT_API_BASE_URL = 'https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach token & custom base URL if configured
client.interceptors.request.use(
  function (config) {
    const customUrl = localStorage.getItem('tala_api_url');
    if (customUrl && customUrl.trim()) {
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

// Response interceptor: handle standard envelope & transform errors with status codes & details
client.interceptors.response.use(
  function (response) {
    // Return standard response data directly
    return response.data;
  },
  function (error) {
    const parsed = parseApiError(error);

    // Auto-clear auth on 401 Unauthorized
    if (parsed.statusCode === 401 || error.response?.status === 401) {
      localStorage.removeItem('tala_token');
      localStorage.removeItem('token');
      localStorage.removeItem('tala_user_id');
      localStorage.removeItem('tala_auth');
      localStorage.removeItem('tala_user');
    }

    const rejection = {
      success: false,
      statusCode: parsed.statusCode,
      message: parsed.message,
      errors: parsed.errors,
      displayText: parsed.displayText,
      originalError: error
    };

    return Promise.reject(rejection);
  }
);

export default client;
