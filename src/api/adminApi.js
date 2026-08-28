import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseAdminUser(u) {
  if (!u) return null;
  const id = String(u._id || u.id || '');
  return {
    id,
    _id: id,
    name: u.name || '',
    phone: u.phone || u.mobile || '',
    role: u.role || 'user',
    address: u.address || '',
    avatar: u.avatar || '',
    isActive: u.isActive !== undefined ? u.isActive : true,
    createdAt: u.createdAt || '',
    isAdmin: Boolean(u.role === 'admin')
  };
}

export const adminApi = {
  /**
   * Get Admin Dashboard stats
   * GET /api/admin/dashboard
   */
  async getDashboard() {
    try {
      const response = await client.get('/admin/dashboard');
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'آمار داشبورد دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Get all users list
   * GET /api/admin/users
   */
  async getUsers(params = {}) {
    try {
      const response = await client.get('/admin/users', { params });
      let list = [];
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          list = response.data;
        } else if (response.data?.users && Array.isArray(response.data.users)) {
          list = response.data.users;
        }
      } else if (Array.isArray(response)) {
        list = response;
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: list.map(parseAdminUser).filter(Boolean),
        message: response?.message || 'لیست کاربران دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Change user role
   * PUT /api/admin/users/:id/role
   * Body: { role: 'admin' | 'user' }
   */
  async updateUserRole(userId, role) {
    try {
      const response = await client.put(`/admin/users/${userId}/role`, { role });
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'نقش کاربر به‌روزرسانی شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Toggle user active status
   * PUT /api/admin/users/:id/toggle-status
   */
  async toggleUserStatus(userId) {
    try {
      const response = await client.put(`/admin/users/${userId}/toggle-status`);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: response?.data,
        message: response?.message || 'وضعیت دسترسی کاربر تغییر یافت'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Get all orders in system
   * GET /api/admin/orders
   */
  async getAdminOrders(params = {}) {
    try {
      const response = await client.get('/admin/orders', { params });
      let list = [];
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          list = response.data;
        } else if (response.data?.orders && Array.isArray(response.data.orders)) {
          list = response.data.orders;
        }
      } else if (Array.isArray(response)) {
        list = response;
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: list,
        message: response?.message || 'لیست سفارش‌های سیستمی دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default adminApi;
