import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseUser(u) {
  if (!u) return null;
  return {
    id: String(u._id || u.id || ''),
    _id: String(u._id || u.id || ''),
    name: u.name || '',
    phone: u.phone || u.mobile || '',
    role: u.role || 'user',
    address: u.address || '',
    avatar: u.avatar || '',
    isActive: u.isActive !== undefined ? u.isActive : true,
    createdAt: u.createdAt || '',
    isAdmin: Boolean(u.role === 'admin' || u.isAdmin)
  };
}

export const authApi = {
  /**
   * Register new user
   * POST /api/auth/register
   * Body: { name, phone, password, address }
   */
  async register(userData) {
    try {
      const response = await client.post('/auth/register', userData);
      if (response && response.success && response.data?.token) {
        localStorage.setItem('tala_token', response.data.token);
        const parsedUser = parseUser(response.data.user);
        localStorage.setItem('tala_user', JSON.stringify(parsedUser));
        localStorage.setItem('tala_auth', 'true');
        return {
          success: true,
          statusCode: response.statusCode || 201,
          token: response.data.token,
          user: parsedUser,
          message: response.message || 'ثبت‌نام با موفقیت انجام شد'
        };
      }
      return {
        success: true,
        statusCode: response?.statusCode || 201,
        token: response?.data?.token,
        user: parseUser(response?.data?.user),
        message: response?.message || 'ثبت‌نام با موفقیت انجام شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Login user
   * POST /api/auth/login
   * Body: { phone, password }
   */
  async login(credentials) {
    try {
      const response = await client.post('/auth/login', credentials);
      if (response && response.success && response.data?.token) {
        localStorage.setItem('tala_token', response.data.token);
        const parsedUser = parseUser(response.data.user);
        localStorage.setItem('tala_user', JSON.stringify(parsedUser));
        localStorage.setItem('tala_auth', 'true');
        return {
          success: true,
          statusCode: response.statusCode || 200,
          token: response.data.token,
          user: parsedUser,
          message: response.message || 'ورود با موفقیت انجام شد'
        };
      }
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        token: response?.data?.token,
        user: parseUser(response?.data?.user),
        message: response?.message || 'ورود با موفقیت انجام شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Fetch logged-in user profile
   * GET /api/auth/me
   */
  async getProfile() {
    try {
      const response = await client.get('/auth/me');
      if (response && response.success && response.data) {
        const parsedUser = parseUser(response.data.user || response.data);
        localStorage.setItem('tala_user', JSON.stringify(parsedUser));
        return {
          success: true,
          statusCode: response.statusCode || 200,
          user: parsedUser,
          message: response.message || 'اطلاعات پروفایل دریافت شد'
        };
      }
      return {
        success: false,
        statusCode: response?.statusCode || 400,
        user: null,
        message: response?.message || 'خطا در دریافت پروفایل'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Update user profile
   * PUT /api/auth/profile
   * Body: { name?, phone?, avatar?, address? }
   */
  async updateProfile(profileData) {
    try {
      const response = await client.put('/auth/profile', profileData);
      if (response && response.success && response.data) {
        const updated = parseUser(response.data.user || response.data);
        localStorage.setItem('tala_user', JSON.stringify(updated));
        return {
          success: true,
          statusCode: response.statusCode || 200,
          user: updated,
          message: response.message || 'پروفایل با موفقیت ویرایش شد'
        };
      }
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        user: parseUser(response?.data?.user || response?.data),
        message: response?.message || 'پروفایل با موفقیت ویرایش شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Change password
   * PUT /api/auth/change-password
   * Body: { currentPassword, newPassword }
   */
  async changePassword(passwordData) {
    try {
      const response = await client.put('/auth/change-password', passwordData);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'رمز عبور با موفقیت تغییر کرد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('tala_token');
    localStorage.removeItem('token');
    localStorage.removeItem('tala_auth');
    localStorage.removeItem('tala_user');
    return { success: true, statusCode: 200, message: 'از حساب کاربری خارج شدید.' };
  }
};

export default authApi;
