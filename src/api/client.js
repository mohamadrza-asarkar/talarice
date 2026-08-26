import axios from 'axios';

// Get base URL from environment or localStorage or default to '/api'
export const getBaseURL = () => {
  const custom = typeof window !== 'undefined' ? (localStorage.getItem('tala_backend_url') || localStorage.getItem('backend_url')) : null;
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  return import.meta.env.VITE_API_BASE_URL || '/api';
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 8000,
});

// Attach Auth Bearer token and dynamic baseURL to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL();
    const token = localStorage.getItem('tala_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwtToken') ||
                  localStorage.getItem('auth_token') ||
                  (typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('tala_token') || sessionStorage.getItem('token')) : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to extract clear and precise validation / error messages from backend responses
function extractErrorMessage(error) {
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'مهلت زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.';
    }
    if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
      return 'خطا در اتصال به سرور بک‌اند. لطفاً مطمئن شوید سرور بک‌اند اجرا شده و پکیج CORS فعال است.';
    }
    return error.message || 'خطا در برقراری ارتباط با سرور';
  }

  const resData = error.response.data;
  const status = error.response.status;

  if (!resData) {
    if (status === 400) return 'درخواست ارسالی نامعتبر است (کد ۴۰۰). فیلدهای ارسالی را بررسی کنید.';
    if (status === 401) return 'نام کاربری یا رمز عبور نامعتبر است یا نشست شما منقضی شده است.';
    if (status === 403) return 'شما دسترسی لازم برای این عملیات را ندارید.';
    if (status === 404) return 'منبع یا مسیر درخواستی یافت نشد (کد ۴۰۴).';
    if (status === 422) return 'اطلاعات وارد شده معتبر نیست. لطفاً فیلدها را اصلاح کنید.';
    if (status >= 500) return 'خطای داخلی سرور بک‌اند (کد ۵۰۰). لاگ‌های ترمینال سرور را بررسی نمایید.';
    return `خطای سرور (کد ${status})`;
  }

  // If response is plain text / HTML error
  if (typeof resData === 'string') {
    if (resData.includes('<!DOCTYPE') || resData.includes('<html')) {
      return `خطای مسیر سرور (کد ${status} - مسیر یافت نشد یا پاسخ HTML بازگردانده شد)`;
    }
    return resData;
  }

  // 1. Check array of errors (e.g. express-validator: [{ msg: '...', path: 'email' }] or ['...'])
  if (Array.isArray(resData.errors) && resData.errors.length > 0) {
    const errorStrings = resData.errors.map(err => {
      if (typeof err === 'string') return err;
      const field = err.path || err.param || err.field;
      const msg = err.msg || err.message || err.error;
      return field ? `فیلد ${field}: ${msg}` : msg;
    }).filter(Boolean);
    if (errorStrings.length > 0) return errorStrings.join(' | ');
  }

  // 2. Check object of errors (e.g. Mongoose validation: { errors: { email: { message: '...' } } })
  if (resData.errors && typeof resData.errors === 'object') {
    const errorList = Object.entries(resData.errors).map(([key, val]) => {
      if (typeof val === 'string') return `${key}: ${val}`;
      if (val && typeof val === 'object' && (val.message || val.msg)) return val.message || val.msg;
      return `${key}: نامعتبر است`;
    });
    if (errorList.length > 0) return errorList.join(' | ');
  }

  // 3. Check array message
  if (Array.isArray(resData.message) && resData.message.length > 0) {
    return resData.message.join(' | ');
  }

  // 4. Check string message
  if (typeof resData.message === 'string' && resData.message.trim()) {
    return resData.message;
  }

  // 5. Check error property
  if (typeof resData.error === 'string' && resData.error.trim()) {
    return resData.error;
  }

  // 6. Check detail or details
  if (typeof resData.detail === 'string' && resData.detail.trim()) return resData.detail;
  if (typeof resData.details === 'string' && resData.details.trim()) return resData.details;

  return `خطا در اعتبارسنجی داده‌ها (کد ${status})`;
}

// Response interceptor for unified response handling & 401 handling
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ... } or raw payload
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only clear if on protected admin route or invalid token
      const isAuthRequest = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
      if (!isAuthRequest) {
        localStorage.removeItem('tala_token');
        localStorage.removeItem('token');
        localStorage.removeItem('tala_auth');
        localStorage.removeItem('tala_user');
      }
    }

    const message = extractErrorMessage(error);
    return Promise.reject({
      success: false,
      message,
      status: error.response?.status,
      data: error.response?.data,
      errors: error.response?.data?.errors,
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
