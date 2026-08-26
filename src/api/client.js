import axios from 'axios';

// ۱. دریافت آدرس سرور (اولویت: تنظیمات کاربر، سپس متغیر محیطی، سپس لوکال)
export const getBaseURL = () => {
  const customUrl = localStorage.getItem('backend_url') || localStorage.getItem('tala_backend_url');
  if (customUrl?.trim()) return customUrl.trim().replace(/\/+$/, '');
  
  return import.meta.env.VITE_API_BASE_URL || '/api';
};

// ۲. ساخت نمونه Axios
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ۳. اینترسپتور درخواست: ارسال توکن احراز هویت
apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseURL();
  const token = localStorage.getItem('token') || localStorage.getItem('tala_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ۴. اینترسپتور پاسخ: ساده‌سازی خروجی و مدیریت خطاها
apiClient.interceptors.response.use(
  (response) => response.data, // مستقیم دیتا را برمی‌گرداند بدون نیاز به response.data اضافی
  (error) => {
    // مدیریت انقضای توکن (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tala_token');
      localStorage.removeItem('tala_auth');
      localStorage.removeItem('tala_user');
    }

    // استخراج پیام خطا به زبان ساده
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      (error.code === 'ECONNABORTED' ? 'مهلت زمان درخواست به پایان رسید.' : 'خطا در ارتباط با سرور');

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

// ۵. توابع کمکی برای استفاده راحت‌تر در پروژه
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  
  // برای آپلود فایل (نیازی به تنظیم دستی Content-Type نیست، خود مرورگر انجام می‌دهد)
  upload: (url, formData, config) => apiClient.post(url, formData, config),
};

export default apiClient;
