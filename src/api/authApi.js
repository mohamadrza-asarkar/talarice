import { getApiBaseUrl, resolveUrl } from './client';
import { parseApiError } from '../utils/errorHandler';

export { getApiBaseUrl };

/**
 * آدرس پایه وب‌سرویس بک‌اند (API Base URL)
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * دریافت هدرهای استاندارد احراز هویت
 */
export function getAuthHeaders() {
  const token =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('tala_token') || localStorage.getItem('token'))
      : null;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
    headers['authorization'] = `Bearer ${cleanToken}`;
    headers['x-auth-token'] = cleanToken;
    headers['token'] = cleanToken;
  }

  return headers;
}

/**
 * بررسی دسترسی مدیر (Admin) با پوشش تمامی حالات و فرمت‌های سرور
 */
export function checkIsAdmin(userData) {
  if (!userData || typeof userData !== 'object') return false;

  // ۱. فیلدهای بولی یا عددی صریح
  if (
    userData.isAdmin === true ||
    userData.isAdmin === 1 ||
    userData.isAdmin === 'true' ||
    userData.isAdmin === '1' ||
    userData.is_admin === true ||
    userData.is_admin === 1 ||
    userData.is_admin === 'true' ||
    userData.is_admin === '1'
  ) {
    return true;
  }

  // ۲. فیلدهای متنی نقش
  const rawRole = String(
    userData.role ||
    userData.userType ||
    userData.user_type ||
    userData.type ||
    userData.access ||
    userData.level ||
    ''
  ).toLowerCase().trim();

  const adminRoles = ['admin', 'superadmin', 'manager', 'owner', 'administrator', 'root', 'مدیر', 'ادمین'];
  if (adminRoles.includes(rawRole)) return true;

  // ۳. آرایه‌های نقش
  const rolesList = Array.isArray(userData.roles)
    ? userData.roles
    : (Array.isArray(userData.permissions) ? userData.permissions : []);

  if (rolesList.some(r => adminRoles.includes(String(r).toLowerCase().trim()))) {
    return true;
  }

  // ۴. بررسی ویژگی‌های تو در تو
  if (userData.user && typeof userData.user === 'object' && checkIsAdmin(userData.user)) return true;
  if (userData.data && typeof userData.data === 'object' && checkIsAdmin(userData.data)) return true;

  return false;
}

/**
 * نرمال‌سازی و قالب‌بندی اطلاعات کاربر دریافت شده از سرور
 */
export function formatUser(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // استخراج شیء اصلی کاربر در صورتی که در زیرمجموعه قرار داشته باشد
  const u = raw.user || raw.data?.user || raw.data?.profile || raw.profile || raw.result?.user || raw.data || raw;
  if (!u || typeof u !== 'object') return null;

  const isAdmin = checkIsAdmin(u) || checkIsAdmin(raw) || checkIsAdmin(raw?.data);
  const rawRole = String(u.role || u.userType || u.user_type || raw.role || '').toLowerCase().trim();
  const normalizedRole = isAdmin ? 'admin' : (rawRole || 'user');

  const userId = String(u._id || u.id || u.userId || raw._id || raw.id || raw.userId || '');

  return {
    id: userId,
    _id: userId,
    name: u.name || u.fullName || u.username || raw.name || raw.username || 'کاربر گرامی',
    phone: u.phone || u.mobile || u.phoneNumber || raw.phone || raw.mobile || '',
    role: normalizedRole,
    roles: Array.isArray(u.roles) ? u.roles : [normalizedRole],
    address: u.address || raw.address || '',
    addresses: Array.isArray(u.addresses) ? u.addresses : (u.address ? [u.address] : []),
    avatar: u.avatar || '',
    isActive: u.isActive !== undefined ? u.isActive : true,
    isAdmin: isAdmin,
    createdAt: u.createdAt || ''
  };
}

/**
 * متغیرهای کنترل تکرار درخواست (Deduplication) و کش جهت جلوگیری از ارسال ده‌ها درخواست به /auth/me
 */
let inFlightProfilePromise = null;
let cachedProfileData = null;
let lastProfileFetchTime = 0;
const PROFILE_CACHE_TTL = 10000; // ۱۰ ثانیه کش سبک جهت ادغام فراخوانی‌های همزمان

/**
 * متد کمکی اجرای Fetch بدون استفاده از XMLHttpRequest (کاملاً بدون XHR)
 */
async function fetchJson(url, options = {}) {
  const fullUrl = resolveUrl(url);
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(fullUrl, config);
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
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
      data = text ? { message: text } : {};
    }
  }

  return { response, data };
}

/**
 * ماژول احراز هویت و مدیریت کاربران مبتنی بر Fetch بومی مرورگر (بدون XHR)
 */
export const authApi = {
  /**
   * ۱. ثبت‌نام کاربر جدید
   * POST /api/auth/register
   */
  async register(userData) {
    try {
      const { response, data } = await fetchJson('/auth/register', {
        method: 'POST',
        body: userData
      });

      const responseData = data || {};
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          message: responseData.message || responseData.error || 'خطا در ثبت‌نام کاربر',
          errors: responseData.errors || null,
          data: responseData
        };
      }

      const token = responseData.token || responseData.data?.token || responseData.accessToken;
      const user = formatUser(responseData);

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tala_token', token);
      }
      if (user) {
        const uid = user.id || user._id;
        if (uid) {
          localStorage.setItem('userId', uid);
          localStorage.setItem('tala_user_id', uid);
        }
        localStorage.setItem('tala_user', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
        cachedProfileData = {
          success: true,
          statusCode: 200,
          user: user,
          message: responseData.message || 'ثبت‌نام با موفقیت انجام شد'
        };
        lastProfileFetchTime = Date.now();
      }

      return {
        success: true,
        statusCode: response.status || 201,
        token: token,
        user: user,
        message: responseData.message || 'ثبت‌نام با موفقیت انجام شد'
      };
    } catch (error) {
      const parsed = parseApiError(error);
      return {
        success: false,
        statusCode: parsed.statusCode || 0,
        message: parsed.message || 'عدم اتصال به سرور محلی/ترموکس',
        errors: parsed.errors || null,
        data: null
      };
    }
  },

  /**
   * ۲. ورود کاربر به سیستم
   * POST /api/auth/login
   */
  async login(credentials) {
    try {
      const { response, data } = await fetchJson('/auth/login', {
        method: 'POST',
        body: credentials
      });

      const responseData = data || {};
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          message: responseData.message || responseData.error || 'نام کاربری یا رمز عبور اشتباه است',
          errors: responseData.errors || null,
          data: responseData
        };
      }

      const token = responseData.token || responseData.data?.token || responseData.accessToken;
      const user = formatUser(responseData);

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('tala_token', token);
      }
      if (user) {
        const uid = user.id || user._id;
        if (uid) {
          localStorage.setItem('userId', uid);
          localStorage.setItem('tala_user_id', uid);
        }
        localStorage.setItem('tala_user', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
        cachedProfileData = {
          success: true,
          statusCode: 200,
          user: user,
          message: responseData.message || 'ورود با موفقیت انجام شد'
        };
        lastProfileFetchTime = Date.now();
      }

      return {
        success: true,
        statusCode: response.status || 200,
        token: token,
        user: user,
        message: responseData.message || 'ورود با موفقیت انجام شد'
      };
    } catch (error) {
      const parsed = parseApiError(error);
      return {
        success: false,
        statusCode: parsed.statusCode || 0,
        message: parsed.message || 'عدم دسترسی به سرور محلی/ترموکس',
        errors: parsed.errors || null,
        data: null
      };
    }
  },

  /**
   * ۳. دریافت اطلاعات حساب کاربری وارد شده با محافظت کامل در برابر ارسال مکرر درخواست (Deduplication)
   * GET /api/auth/me
   * @param {boolean} force - در صورت نیاز به بای‌پس کش
   */
  async getProfile(force = false) {
    const token =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem('tala_token') || localStorage.getItem('token'))
        : null;

    if (!token) {
      return {
        success: false,
        statusCode: 401,
        user: null,
        message: 'توکن ورود یافت نشد'
      };
    }

    // بررسی کش اخیر جهت جلوگیری از اسپم درخواست
    if (!force && cachedProfileData && (Date.now() - lastProfileFetchTime < PROFILE_CACHE_TTL)) {
      return cachedProfileData;
    }

    // در صورتی که درخواستی در حال حاضر در جریان است، همان پرامیس بازگردانده می‌شود
    if (inFlightProfilePromise) {
      return inFlightProfilePromise;
    }

    inFlightProfilePromise = (async () => {
      try {
        const { response, data } = await fetchJson('/auth/me', {
          method: 'GET'
        });

        const responseData = data || {};
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('tala_token');
            localStorage.removeItem('user');
            localStorage.removeItem('tala_user');
            localStorage.removeItem('userId');
            localStorage.removeItem('tala_user_id');
            cachedProfileData = null;
          }

          const result = {
            success: false,
            statusCode: response.status,
            user: null,
            message: responseData.message || responseData.error || 'خطا در دریافت اطلاعات کاربری',
            data: responseData
          };
          lastProfileFetchTime = Date.now();
          return result;
        }

        const user = formatUser(responseData);
        if (user) {
          const uid = user.id || user._id;
          if (uid) {
            localStorage.setItem('userId', uid);
            localStorage.setItem('tala_user_id', uid);
          }
          localStorage.setItem('tala_user', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
        }

        const result = {
          success: true,
          statusCode: response.status || 200,
          user: user,
          message: responseData.message || 'اطلاعات کاربری دریافت شد'
        };

        cachedProfileData = result;
        lastProfileFetchTime = Date.now();
        return result;
      } catch (error) {
        lastProfileFetchTime = Date.now();
        const parsed = parseApiError(error);
        return {
          success: false,
          statusCode: parsed.statusCode || 0,
          user: null,
          message: parsed.message || 'خطا در برقراری ارتباط با سرور',
          data: null
        };
      } finally {
        inFlightProfilePromise = null;
      }
    })();

    return inFlightProfilePromise;
  },

  /**
   * ۴. ویرایش مشخصات حساب کاربری
   * PUT /api/auth/profile
   */
  async updateProfile(profileData) {
    try {
      const { response, data } = await fetchJson('/auth/profile', {
        method: 'PUT',
        body: profileData
      });

      const responseData = data || {};
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          message: responseData.message || responseData.error || 'خطا در ویرایش پروفایل',
          data: responseData
        };
      }

      const user = formatUser(responseData);
      if (user) {
        localStorage.setItem('tala_user', JSON.stringify(user));
        localStorage.setItem('user', JSON.stringify(user));
        cachedProfileData = {
          success: true,
          statusCode: 200,
          user: user,
          message: responseData.message || 'پروفایل با موفقیت به‌روزرسانی شد'
        };
        lastProfileFetchTime = Date.now();
      }

      return {
        success: true,
        statusCode: response.status || 200,
        user: user,
        message: responseData.message || 'پروفایل با موفقیت به‌روزرسانی شد'
      };
    } catch (error) {
      const parsed = parseApiError(error);
      return {
        success: false,
        statusCode: parsed.statusCode || 0,
        message: parsed.message || 'خطا در ویرایش پروفایل',
        data: null
      };
    }
  },

  /**
   * ۵. تغییر کلمه عبور
   * PUT /api/auth/change-password
   */
  async changePassword(passwordData) {
    try {
      const payload = {
        oldPassword: passwordData.oldPassword || passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      const { response, data } = await fetchJson('/auth/change-password', {
        method: 'PUT',
        body: payload
      });

      const responseData = data || {};
      if (!response.ok) {
        return {
          success: false,
          statusCode: response.status,
          message: responseData.message || responseData.error || 'خطا در تغییر رمز عبور',
          data: responseData
        };
      }

      return {
        success: true,
        statusCode: response.status || 200,
        message: responseData.message || 'رمز عبور با موفقیت تغییر کرد'
      };
    } catch (error) {
      const parsed = parseApiError(error);
      return {
        success: false,
        statusCode: parsed.statusCode || 0,
        message: parsed.message || 'خطا در تغییر رمز عبور',
        data: null
      };
    }
  },

  /**
   * ۶. خروج از حساب کاربری
   */
  logout() {
    cachedProfileData = null;
    inFlightProfilePromise = null;
    lastProfileFetchTime = 0;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('tala_token');
      localStorage.removeItem('user');
      localStorage.removeItem('tala_user');
      localStorage.removeItem('userId');
      localStorage.removeItem('tala_user_id');
      localStorage.removeItem('tala_auth');
    }
    return {
      success: true,
      statusCode: 200,
      message: 'از حساب کاربری خارج شدید'
    };
  }
};

export default authApi;
