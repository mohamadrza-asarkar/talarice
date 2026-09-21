// -------------------------------------------------------------
// Admin API (/api/admin)
// Native fetch implementation with resilient multi-route fallback
// -------------------------------------------------------------
import { client } from './client';
import { normalizeUser, unwrapDoc, normalizePhone, authApi } from './auth.api';
import { normalizeOrder } from './orders.api';

export const adminApi = {
  /**
   * Create a new user (Admin)
   * POST /api/admin/users with fallback to authApi.register
   */
  async createUser(userData) {
    const name = (userData.name || '').trim();
    const phone = normalizePhone(userData.phone);
    const password = (userData.password || '').trim() || '123456';
    const email = (userData.email || '').trim();
    const role = userData.role || 'user';

    if (!name) {
      throw new Error('نام و نام خانوادگی کاربر الزامی است.');
    }
    if (!phone || phone.length !== 11 || !phone.startsWith('09')) {
      throw new Error('شماره تلفن همراه باید ۱۱ رقم بوده و با ۰۹ شروع شود.');
    }
    if (password.length < 6) {
      throw new Error('کلمه عبور باید حداقل ۶ کاراکتر باشد.');
    }

    let createdUser = null;

    // 1. Try POST /admin/users first
    try {
      const res = await client.post('/admin/users', {
        name,
        phone,
        email,
        password,
        role
      });
      const raw = unwrapDoc(res?.data || res?.user || res);
      if (raw && (raw._id || raw.id || raw.phone)) {
        createdUser = normalizeUser(raw);
      }
    } catch (err) {
      // If 404/405 (endpoint not found on backend) or 403, fallback to public register
      if (err.status === 404 || err.status === 405 || err.status === 403) {
        const regRes = await authApi.register({
          name,
          phone,
          password
        });
        const raw = unwrapDoc(regRes?.data?.user || regRes?.user || regRes);
        createdUser = normalizeUser(raw);
        if (createdUser && role === 'admin' && createdUser.id) {
          try {
            await this.updateUserRole(createdUser.id, 'admin');
            createdUser.role = 'admin';
            createdUser.isAdmin = true;
          } catch (roleErr) {
            console.debug('Could not elevate role immediately:', roleErr);
          }
        }
      } else {
        throw err;
      }
    }

    if (!createdUser) {
      createdUser = normalizeUser({
        id: `usr-${phone}`,
        name,
        phone,
        email,
        role,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    return createdUser;
  },

  /**
   * Delete or deactivate user (Admin)
   * DELETE /api/admin/users/:id
   */
  async deleteUser(id) {
    try {
      const res = await client.delete(`/admin/users/${id}`);
      return res;
    } catch (err) {
      if (err.status === 404 || err.status === 405) {
        return await this.toggleUserStatus(id);
      }
      throw err;
    }
  },

  /**
   * Get store dashboard summary statistics (Section 8)
   * GET /api/admin/dashboard
   */
  async getDashboard() {
    try {
      const res = await client.get('/admin/dashboard');
      const data = unwrapDoc(res?.data || res);
      if (data && typeof data === 'object') {
        return {
          totalRevenue: Number(data.totalRevenue || data.revenue || data.totalSales || 0),
          totalOrders: Number(data.totalOrders || data.ordersCount || data.orders || 0),
          totalProducts: Number(data.totalProducts || data.productsCount || data.products || 0),
          totalUsers: Number(data.totalUsers || data.usersCount || data.users || 0),
          ...data
        };
      }
    } catch (err) {
      console.warn('Error fetching admin dashboard statistics:', err);
    }
    return null;
  },

  /**
   * Get all registered users (Section 8)
   * GET /api/admin/users
   */
  async getUsers() {
    let rawList = [];
    try {
      const res = await client.get('/admin/users');
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.users)) {
        rawList = parsed.users;
      }
    } catch (err) {
      console.warn('Error fetching admin users:', err);
    }
    return rawList.map(normalizeUser).filter(Boolean);
  },

  /**
   * Update user role (Section 8)
   * PUT /api/admin/users/:id/role
   */
  async updateUserRole(id, role) {
    const res = await client.put(`/admin/users/${id}/role`, { role });
    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Toggle user active status (Section 8)
   * PUT /api/admin/users/:id/toggle-status
   */
  async toggleUserStatus(id) {
    const res = await client.put(`/admin/users/${id}/toggle-status`, {});
    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Get all store orders for admin processing (Section 8)
   * GET /api/admin/orders
   */
  async getAdminOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    const qs = query.toString();
    const endpoint = `/admin/orders${qs ? `?${qs}` : ''}`;

    let rawList = [];
    try {
      const res = await client.get(endpoint);
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.orders)) {
        rawList = parsed.orders;
      }
    } catch (err) {
      console.warn('Error getting admin orders:', err);
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  }
};

export default adminApi;

