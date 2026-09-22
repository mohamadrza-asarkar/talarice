// -------------------------------------------------------------
// Base API URL - Change this single URL to sync all APIs
// -------------------------------------------------------------
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // If hosted on non-localhost, default to relative '/api' endpoint to match deployment domain routing
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export function getImageUrl(imgPath) {
  if (!imgPath || typeof imgPath !== 'string') {
    return '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  }
  const trimmed = imgPath.trim();
  if (!trimmed) {
    return '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  }

  const baseUrl = API_BASE_URL.startsWith('/')
    ? (typeof window !== 'undefined' ? window.location.origin : '') + API_BASE_URL.replace(/\/api\/?$/, '')
    : API_BASE_URL.replace(/\/api\/?$/, '');

  // If backend returns a hardcoded localhost:5000 path but the app is hosted elsewhere, replace it with the real baseUrl
  if (
    trimmed.startsWith('http://localhost:5000') ||
    trimmed.startsWith('https://localhost:5000') ||
    trimmed.startsWith('http://127.0.0.1:5000') ||
    trimmed.startsWith('https://127.0.0.1:5000')
  ) {
    const relativePart = trimmed.replace(/^(https?:\/\/(localhost|127\.0\.0\.1):5000)/, '');
    const cleanPath = relativePart.startsWith('/') ? relativePart : `/${relativePart}`;
    return `${baseUrl}${cleanPath}`;
  }

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${baseUrl}${cleanPath}`;
}

export const TOKEN_STORAGE_KEY = 'tala_rice_token';


export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not store token:', err);
  }
}

/**
 * Modern native fetch wrapper with automatic token injection & error handling
 */
export async function request(endpoint, options = {}) {
  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  // Automatically serialize options.params if provided (Axios compatibility)
  if (options.params && typeof options.params === 'object') {
    const query = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const token = getStoredToken();
  const rawBody = options.body !== undefined ? options.body : options.data;
  const isFormData = typeof FormData !== 'undefined' && rawBody instanceof FormData;
  const isAuthPublicRoute = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

  // Preserve Content-Type and Accept headers properly without options.headers overwriting Content-Type
  const customHeaders = { ...(options.headers || {}) };
  if (isFormData) {
    delete customHeaders['Content-Type'];
    delete customHeaders['content-type'];
  }

  const headers = {
    'Accept': 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && !isAuthPublicRoute && !options.skipAuth ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };

  let body = undefined;
  if (rawBody !== undefined && rawBody !== null) {
    if (isFormData || typeof rawBody === 'string') {
      body = rawBody;
    } else {
      body = JSON.stringify(rawBody);
    }
  }

  const { headers: _h, body: _b, data: _d, ...restOptions } = options;

  const config = {
    method: options.method || 'GET',
    headers,
    ...restOptions
  };

  if (body !== undefined && config.method !== 'GET' && config.method !== 'HEAD') {
    config.body = body;
  }

  try {
    const response = await fetch(url, config);
    let data = null;
    const isNoBody = response.status === 304 || response.status === 204;

    if (!isNoBody) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = {};
        }
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } else {
      data = { status: response.status, success: true };
    }

    if (!response.ok && response.status !== 304) {
      let rawMsg = data?.message || data?.error;
      const isHtmlError = !rawMsg || typeof rawMsg !== 'string' || rawMsg.trim().startsWith('<') || rawMsg.includes('<!DOCTYPE') || rawMsg.includes('<html');

      let errorMsg = !isHtmlError ? rawMsg : '';

      if (response.status === 401) {
        if (isAuthPublicRoute) {
          errorMsg = errorMsg || 'شماره موبایل یا رمز عبور وارد شده اشتباه است.';
        } else {
          errorMsg = errorMsg || 'نشست کاربری شما منقضی شده است یا نیاز به دسترسی مدیر دارید (خطای ۴۰۱). لطفاً مجدداً وارد شوید.';
          setStoredToken(null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint, status: 401 } }));
          }
        }
      } else if (response.status === 403) {
        errorMsg = errorMsg || 'دسترسی به این بخش نیازمند مجوز مدیریت سامانه است (خطای ۴۰۳).';
      } else if (response.status === 400) {
        errorMsg = errorMsg || 'اطلاعات ارسالی نامعتبر یا شماره موبایل تکراری است.';
      } else if (response.status === 422) {
        errorMsg = errorMsg || 'فرمت اطلاعات ورودی نامعتبر است. لطفاً شماره موبایل (۱۱ رقم با ۰۹) و رمز عبور (حداقل ۶ کاراکتر) را بررسی کنید.';
      } else if (response.status === 404) {
        errorMsg = errorMsg || 'اطلاعات یا آیتم مورد نظر در سرور یافت نشد (خطای ۴۰۴).';
      } else if (response.status >= 500) {
        errorMsg = 'سرور با خطای موقت مواجه شد. لطفاً لحظاتی بعد مجدداً تلاش نمایید.';
      } else if (!errorMsg) {
        errorMsg = `خطای سرور (کد ${response.status})`;
      }

      const error = new Error(errorMsg);
      error.status = response.status;
      error.statusCode = response.status;
      error.data = data;
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('عدم برقراری ارتباط با وب‌سرویس بک‌اند (لطفاً اتصال اینترنت یا آدرس سرور را بررسی کنید).');
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
}

export const client = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

export default client;
