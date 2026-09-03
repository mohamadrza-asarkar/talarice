import axios from 'axios';

/**
 * آدرس پایه وب‌سرویس بک‌اند (API Base URL)
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api';

/**
 * دریافت هدرهای احراز هویت شامل توکن کاربر
 */
export function getAuthHeaders() {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('tala_token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * نرمال‌سازی و قالب‌بندی اطلاعات کاربر
 */
function formatUser(userData) {
  if (!userData) return null;
  const role = String(userData.role || '').toLowerCase().trim();
  const isAdmin = role === 'admin' || role === 'superadmin' || role === 'manager' || userData.isAdmin === true;

  return {
    id: String(userData._id || userData.id || ''),
    _id: String(userData._id || userData.id || ''),
    name: userData.name || '',
    phone: userData.phone || userData.mobile || '',
    role: role || (isAdmin ? 'admin' : 'user'),
    address: userData.address || '',
    avatar: userData.avatar || '',
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    isAdmin: isAdmin,
    createdAt: userData.createdAt || ''
  };
}

/**
 * ماژول احراز هویت و مدیریت کاربران با استفاده مستقیم از axios.post و axios.get
 */
export const authApi = {
  /**
   * ۱. ثبت‌نام کاربر جدید
   * POST /api/auth/register
   * @param {Object} userData - { name, phone, password, address }
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
        headers: getAuthHeaders()
      });

      const responseData = response.data || {};
      const token = responseData.token || responseData.data?.token || responseData.accessToken;
      const rawUser = responseData.user || responseData.data?.user || responseData.data;
      const user = formatUser(rawUser);

      // ذخیره توکن و مشخصات در localStorage برای ورود خودکار
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tala_token', token);
      }
      if (user) {
        if (user.id) {
          localStorage.setItem('userId', user.id);
          localStorage.setItem('tala_user_id', user.id);
        }
      }

      return {
        success: true,
        statusCode: responseData.statusCode || 201,
        token: token,
        user: user,
        message: responseData.message || 'ثبت‌نام با موفقیت انجام شد'
      };
    } catch (error) {
      // استخراج مستقیم پیام و وضعیت خطای ارسالی از سمت بک‌اند
      const statusCode =
        error.response?.data?.statusCode ||
        error.response?.status ||
        (error.request ? 0 : 500);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.request
          ? 'عدم برقراری ارتباط با سرور، لطفاً اتصال اینترنت خود را بررسی کنید'
          : error.message || 'خطا در ثبت‌نام کاربر');

      return {
        success: false,
        statusCode: statusCode,
        message: message,
        errors: error.response?.data?.errors || null,
        data: error.response?.data || null
      };
    }
  },

  /**
   * ۲. ورود کاربر
   * POST /api/auth/login
   * @param {Object} credentials - { phone, password }
   */
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        headers: getAuthHeaders()
      });

      const responseData = response.data || {};
      const token = responseData.token || responseData.data?.token || responseData.accessToken;
      const rawUser = responseData.user || responseData.data?.user || responseData.data;
      const user = formatUser(rawUser);

      // ذخیره توکن و مشخصات در localStorage برای ماندگاری و ورود خودکار
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tala_token', token);
      }
      if (user) {
        if (user.id) {
          localStorage.setItem('userId', user.id);
          localStorage.setItem('tala_user_id', user.id);
        }
      }

      return {
        success: true,
        statusCode: responseData.statusCode || 200,
        token: token,
        user: user,
        message: responseData.message || 'ورود با موفقیت انجام شد'
      };
    } catch (error) {
      // استخراج مستقیم پیام و وضعیت خطای ارسالی از سمت بک‌اند
      const statusCode =
        error.response?.data?.statusCode ||
        error.response?.status ||
        (error.request ? 0 : 500);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.request
          ? 'عدم برقراری ارتباط با سرور، لطفاً اتصال اینترنت خود را بررسی کنید'
          : error.message || 'نام کاربری یا رمز عبور اشتباه است');

      return {
        success: false,
        statusCode: statusCode,
        message: message,
        errors: error.response?.data?.errors || null,
        data: error.response?.data || null
      };
    }
  },

  /**
   * ۳. دریافت اطلاعات حساب کاربری وارد شده
   * GET /api/auth/me
   */
  async getProfile() {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('tala_token');
      if (!token) {
        return {
          success: false,
          statusCode: 401,
          user: null,
          message: 'توکن ورود یافت نشد'
        };
      }

      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });

      const responseData = response.data || {};
      const rawUser = responseData.user || responseData.data?.user || responseData.data || responseData;
      const user = formatUser(rawUser);

      if (user && (user.id || user.name || user.phone)) {
        if (user.id) {
          localStorage.setItem('userId', user.id);
          localStorage.setItem('tala_user_id', user.id);
        }
      }

      return {
        success: true,
        statusCode: responseData.statusCode || 200,
        user: user,
        message: responseData.message || 'اطلاعات کاربری دریافت شد'
      };
    } catch (error) {
      const statusCode =
        error.response?.data?.statusCode ||
        error.response?.status ||
        (error.request ? 0 : 500);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'خطا در دریافت اطلاعات کاربری';

      // در صورت منقضی بودن توکن (401)، پاکسازی اطلاعات
      if (statusCode === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tala_token');
        localStorage.removeItem('user');
        localStorage.removeItem('tala_user');
        localStorage.removeItem('userId');
        localStorage.removeItem('tala_user_id');
      }

      return {
        success: false,
        statusCode: statusCode,
        user: null,
        message: message,
        data: error.response?.data || null
      };
    }
  },

  /**
   * ۴. ویرایش مشخصات حساب کاربری
   * PUT /api/auth/profile
   * @param {Object} profileData - { name?, phone?, address?, avatar? }
   */
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData, {
        headers: getAuthHeaders()
      });

      const responseData = response.data || {};
      const rawUser = responseData.user || responseData.data?.user || responseData.data;
      const user = formatUser(rawUser);

      if (user) {
      }

      return {
        success: true,
        statusCode: responseData.statusCode || 200,
        user: user,
        message: responseData.message || 'پروفایل با موفقیت به‌روزرسانی شد'
      };
    } catch (error) {
      const statusCode =
        error.response?.data?.statusCode ||
        error.response?.status ||
        500;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'خطا در ویرایش پروفایل';

      return {
        success: false,
        statusCode: statusCode,
        message: message,
        data: error.response?.data || null
      };
    }
  },

  /**
   * ۵. تغییر کلمه عبور
   * PUT /api/auth/change-password
   * @param {Object} passwordData - { currentPassword, newPassword }
   */
  async changePassword(passwordData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/change-password`, passwordData, {
        headers: getAuthHeaders()
      });

      const responseData = response.data || {};
      return {
        success: true,
        statusCode: responseData.statusCode || 200,
        message: responseData.message || 'رمز عبور با موفقیت تغییر کرد'
      };
    } catch (error) {
      const statusCode =
        error.response?.data?.statusCode ||
        error.response?.status ||
        500;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'خطا در تغییر رمز عبور';

      return {
        success: false,
        statusCode: statusCode,
        message: message,
        data: error.response?.data || null
      };
    }
  },

  /**
   * ۶. خروج از حساب کاربری (Logout)
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tala_token');
    localStorage.removeItem('user');
    localStorage.removeItem('tala_user');
    localStorage.removeItem('userId');
    localStorage.removeItem('tala_user_id');
    localStorage.removeItem('tala_auth');
    return {
      success: true,
      statusCode: 200,
      message: 'از حساب کاربری خارج شدید'
    };
  }
};

export default authApi;
