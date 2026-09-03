import axios from 'axios';
import { parseApiError } from '../utils/errorHandler';

/**
 * دریافت آدرس پایه وب‌سرویس بک‌اند (API Base URL)
 * مناسب برای اجرا روی ترموکس (Termux)، لوکال‌هاست یا محیط شبکه
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
    if (window.location.port === '5000') {
      return '/api';
    }
    return `http://${hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
}

// Default backend Base URL
export const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

/**
 * ایجاد هدرها و تنظیمات درخواست برای استفاده مستقیم در متدهای axios
 * توجه: withCredentials غیرفعال است تا در مرورگر و ارتباط با سرورهای لوکال/ترموکس خطای CORS ایجاد نشود
 */
function buildRequestConfig(customConfig = {}) {
  const token =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('tala_token') || localStorage.getItem('token'))
      : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customConfig.headers || {})
  };

  // در صورت ارسال FormData هدر Content-Type حذف می‌شود تا مرورگر boundary مناسب بگذارد
  if (customConfig.data instanceof FormData) {
    delete headers['Content-Type'];
  }

  const { headers: _h, ...restConfig } = customConfig;

  return {
    headers,
    timeout: 15000,
    withCredentials: false,
    ...restConfig
  };
}

/**
 * تبدیل مسیرهای نسبی به آدرس کامل بر اساس Base URL
 */
function resolveUrl(url) {
  if (!url) return getApiBaseUrl();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = getApiBaseUrl();
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * مدیریت یکپارچه خطاها و پاکسازی توکن در صورت ۴۰۱
 */
function handleApiError(error) {
  const parsed = parseApiError(error);

  if (parsed.statusCode === 401 || error.response?.status === 401) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('tala_token');
      localStorage.removeItem('token');
      localStorage.removeItem('tala_user_id');
      localStorage.removeItem('tala_auth');
      localStorage.removeItem('tala_user');
    }
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

/**
 * کلاینت درخواست‌ها با استفاده مستقیم از متدهای اصلی axios (بدون axios.create)
 */
const client = {
  async get(url, config = {}) {
    try {
      const fullUrl = resolveUrl(url);
      const reqConfig = buildRequestConfig(config);
      const res = await axios.get(fullUrl, reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const fullUrl = resolveUrl(url);
      const reqConfig = buildRequestConfig({ ...config, data });
      const res = await axios.post(fullUrl, data, reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const fullUrl = resolveUrl(url);
      const reqConfig = buildRequestConfig({ ...config, data });
      const res = await axios.put(fullUrl, data, reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async delete(url, config = {}) {
    try {
      const fullUrl = resolveUrl(url);
      const reqConfig = buildRequestConfig(config);
      const res = await axios.delete(fullUrl, reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async patch(url, data = {}, config = {}) {
    try {
      const fullUrl = resolveUrl(url);
      const reqConfig = buildRequestConfig({ ...config, data });
      const res = await axios.patch(fullUrl, data, reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async request(config = {}) {
    try {
      const fullUrl = resolveUrl(config.url || '');
      const reqConfig = buildRequestConfig({ ...config, url: fullUrl });
      const res = await axios(reqConfig);
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  }
};

export default client;
