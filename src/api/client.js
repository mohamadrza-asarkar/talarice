import { parseApiError } from '../utils/errorHandler';

/**
 * دریافت آدرس پایه وب‌سرویس بک‌اند (API Base URL)
 * مناسب برای اجرا روی ترموکس (Termux)، لوکال‌هاست یا محیط شبکه
 */
export function getApiBaseUrl() {
  // ۱. بررسی آدرس سفارشی ذخیره شده در حافظه مرورگر
  if (typeof localStorage !== 'undefined') {
    const custom = localStorage.getItem('tala_api_url');
    // پاکسازی آدرس‌های نامعتبر یا قدیمی
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

  // ۳. در محیط مرورگر، اتصال پویا به پورت ۵۰۰۰ همان هاست (مناسب ترموکس و شبکه محلی)
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
 * تبدیل و کامل‌سازی آدرس اینترنتی همراه با اضافه کردن کوئری پارامترها (Query Params)
 */
export function resolveUrl(url, params) {
  let fullUrl = url || '';
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    const base = getApiBaseUrl().replace(/\/+$/, '');
    const cleanPath = fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
    fullUrl = `${base}${cleanPath}`;
  }

  if (params && typeof params === 'object') {
    const queryEntries = Object.entries(params).filter(
      ([, val]) => val !== undefined && val !== null && val !== ''
    );
    if (queryEntries.length > 0) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      const searchParams = new URLSearchParams();
      queryEntries.forEach(([k, v]) => searchParams.append(k, String(v)));
      fullUrl += separator + searchParams.toString();
    }
  }

  return fullUrl;
}

/**
 * هسته اجرای درخواست با Fetch API استاندارد مرورگر (کاملاً بدون XMLHttpRequest / XHR)
 */
async function doFetch(url, options = {}) {
  const {
    method = 'GET',
    data = null,
    body = null,
    headers: customHeaders = {},
    params = null,
    timeout = 15000,
    ...restOptions
  } = options;

  const fullUrl = resolveUrl(url, params);

  // دریافت توکن احراز هویت
  const token =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('tala_token') || localStorage.getItem('token'))
      : null;

  const finalHeaders = {
    ...customHeaders
  };

  if (token && !finalHeaders['Authorization'] && !finalHeaders['authorization']) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const payload = data !== null ? data : body;
  let finalBody = undefined;

  if (payload !== null && payload !== undefined) {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      finalBody = payload;
      // حذف هدر Content-Type برای FormData تا مرورگر خود مرز (boundary) چندبخشی بسازد
      delete finalHeaders['Content-Type'];
      delete finalHeaders['content-type'];
    } else if (typeof payload === 'object') {
      finalBody = JSON.stringify(payload);
      if (!finalHeaders['Content-Type'] && !finalHeaders['content-type']) {
        finalHeaders['Content-Type'] = 'application/json';
      }
    } else {
      finalBody = String(payload);
    }
  }

  // ایجاد AbortController برای اعمال Timeout
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal: controller ? controller.signal : undefined,
      ...restOptions
    });

    if (timeoutId) clearTimeout(timeoutId);

    // بررسی نوع محتوای پاسخ
    const contentType = response.headers.get('content-type') || '';
    let responseData = null;

    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = {};
      }
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text ? { message: text } : {};
      }
    }

    if (!response.ok) {
      // پاکسازی اطلاعات احراز هویت در صورت ۴۰۱
      if (response.status === 401) {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('tala_token');
          localStorage.removeItem('token');
          localStorage.removeItem('tala_user_id');
          localStorage.removeItem('userId');
          localStorage.removeItem('tala_user');
          localStorage.removeItem('user');
        }
      }

      const err = new Error(
        responseData?.message ||
        responseData?.error ||
        `خطای ارتباط با سرور (کد ${response.status})`
      );
      err.response = {
        status: response.status,
        statusCode: response.status,
        data: responseData,
        headers: response.headers
      };
      err.statusCode = response.status;
      err.data = responseData;

      const parsed = parseApiError(err);
      return Promise.reject({
        success: false,
        statusCode: parsed.statusCode,
        message: parsed.message,
        errors: parsed.errors,
        displayText: parsed.displayText,
        data: responseData,
        originalError: err
      });
    }

    return responseData;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);

    // خطای انقضای تایم‌اوت
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('مهلت زمانی اتصال به سرور به پایان رسید (Timeout).');
      timeoutErr.statusCode = 408;
      const parsed = parseApiError(timeoutErr);
      return Promise.reject({
        success: false,
        statusCode: 408,
        message: parsed.message,
        errors: null,
        displayText: 'پاسخی از سرور در زمان مقرر دریافت نشد.',
        originalError: timeoutErr
      });
    }

    // در صورتی که خطا قبلاً ریجکت شده
    if (error && error.statusCode !== undefined) {
      return Promise.reject(error);
    }

    const parsed = parseApiError(error);
    return Promise.reject({
      success: false,
      statusCode: parsed.statusCode || 0,
      message: parsed.message || 'خطا در برقراری ارتباط شبکه با سرور',
      errors: parsed.errors || null,
      displayText: parsed.displayText || 'عدم اتصال به سرور محلی/ترموکس',
      originalError: error
    });
  }
}

/**
 * کلاینت یکپارچه برنامه بدون وابستگی به Axios و بدون استفاده از XMLHttpRequest (XHR)
 * صد در صد مبتنی بر Fetch API بومی مرورگر
 */
export const client = {
  get(url, config = {}) {
    return doFetch(url, { ...config, method: 'GET' });
  },

  post(url, data = null, config = {}) {
    return doFetch(url, { ...config, method: 'POST', data });
  },

  put(url, data = null, config = {}) {
    return doFetch(url, { ...config, method: 'PUT', data });
  },

  delete(url, config = {}) {
    return doFetch(url, { ...config, method: 'DELETE' });
  },

  patch(url, data = null, config = {}) {
    return doFetch(url, { ...config, method: 'PATCH', data });
  },

  request(config = {}) {
    const { url = '', ...rest } = config;
    return doFetch(url, rest);
  }
};

export default client;
