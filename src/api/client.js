import axios from 'axios';
import { parseApiError } from '../utils/errorHandler';

/**
 * دریافت آدرس پایه وب‌سرویس بک‌اند (API Base URL)
 * مناسب برای اجرا روی ترموکس (Termux)، لوکال‌هاست یا محیط پروداکشن
 */
export function getApiBaseUrl() {
  // ۱. بررسی آدرس سفارشی ذخیره شده در حافظه مرورگر
  if (typeof localStorage !== 'undefined') {
    const custom = localStorage.getItem('tala_api_url');
    // پاکسازی آدرس‌های قدیمی کلودران که دیگر در دسترس نیستند
    if (custom && (custom.includes('rpvkewlvjilhjnoamjgjvq') || !custom.trim())) {
      localStorage.removeItem('tala_api_url');
    } else if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }

  // ۲. بررسی متغیر محیطی VITE_API_BASE_URL
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() && !envUrl.includes('rpvkewlvjilhjnoamjgjvq')) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // ۳. در محیط مرورگر، اتصال پویا به پورت ۵۰۰۰ همان هاست (مناسب ترموکس و شبکه محلی گوشی)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
}

// Default backend Base URL
export const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor: attach token & dynamic base URL
client.interceptors.request.use(
  function (config) {
    config.baseURL = getApiBaseUrl();
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
