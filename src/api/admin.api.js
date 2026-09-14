// -------------------------------------------------------------
// Admin API (/api/admin)
// Native fetch implementation with resilient multi-route fallback
// -------------------------------------------------------------
import { client } from './client';
import { normalizeUser, unwrapDoc } from './auth.api';
import { normalizeOrder } from './orders.api';

export const adminApi = {
  /**
   * Get store dashboard summary statistics with smart fallback
   */
  async getDashboard() {
    const candidateEndpoints = [
      '/admin/dashboard',
      '/admin/stats',
      '/admin/analytics',
      '/dashboard'
    ];

    for (const ep of candidateEndpoints) {
      try {
        const res = await client.get(ep);
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
      } catch {
        // Try next endpoint
      }
    }

    return null;
  },

  /**
   * Get all registered users (Admin)
   */
  async getUsers() {
    const candidateEndpoints = [
      '/admin/users',
      '/users',
      '/admin/all-users',
      '/users/all'
    ];

    let rawList = null;
    let lastError = null;

    for (const ep of candidateEndpoints) {
      try {
        const res = await client.get(ep);
        if (Array.isArray(res)) {
          rawList = res;
          break;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
          break;
        } else if (Array.isArray(res?.users)) {
          rawList = res.users;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!rawList) {
      if (lastError && !lastError.isNetworkError && lastError.status !== 404) {
        throw lastError;
      }
      return [];
    }

    return rawList.map(normalizeUser).filter(Boolean);
  },

  /**
   * Create a new user (Admin)
   */
  async createUser(userData) {
    const payload = {
      name: userData.name || '',
      phone: userData.phone || userData.mobile || '',
      mobile: userData.phone || userData.mobile || '',
      password: userData.password || '123456',
      role: userData.role || 'user',
      isAdmin: userData.role === 'admin',
      address: userData.address || '',
      email: userData.email || ''
    };

    const candidateEndpoints = [
      '/admin/users',
      '/users',
      '/auth/register'
    ];

    let res = null;
    let lastErr = null;

    for (const ep of candidateEndpoints) {
      try {
        res = await client.post(ep, payload);
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Update user role (Section 8.3)
   * PUT /api/admin/users/:id/role
   */
  async updateUserRole(id, role) {
    const res = await client.put(`/admin/users/${id}/role`, { role });
    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Toggle user ban / active status (Section 8.4)
   * PUT /api/admin/users/:id/toggle-status
   */
  async toggleUserStatus(id) {
    const res = await client.put(`/admin/users/${id}/toggle-status`, {});
    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Get all store orders for admin processing (Section 8.5)
   * GET /api/admin/orders
   */
  async getAdminOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    const qs = query.toString();
    const endpoint = `/admin/orders${qs ? `?${qs}` : ''}`;

    let rawList = null;
    let lastError = null;

    try {
      const res = await client.get(endpoint);
      if (Array.isArray(res)) {
        rawList = res;
      } else if (Array.isArray(res?.data)) {
        rawList = res.data;
      } else if (Array.isArray(res?.orders)) {
        rawList = res.orders;
      }
    } catch (err) {
      lastError = err;
    }

    if (!rawList) {
      // Fallback to ordersApi.getAllOrders if /admin/orders returned error
      try {
        return await ordersApi.getAllOrders(params);
      } catch {
        if (lastError && !lastError.isNetworkError && lastError.status !== 404) {
          throw lastError;
        }
        return [];
      }
    }

    return rawList.map(normalizeOrder).filter(Boolean);
  },

  /**
   * Update user role / info / status (Admin)
   */
  async updateUser(id, payload) {

    const endpoints = [
      `/admin/users/${id}`,
      `/users/${id}`
    ];
    let res = null;
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        res = await client.put(ep, payload);
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await client.patch(ep, payload);
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = unwrapDoc(res?.data || res?.user || res);
    return normalizeUser(raw);
  },

  /**
   * Delete user (Admin)
   */
  async deleteUser(id) {
    const endpoints = [
      `/admin/users/${id}`,
      `/users/${id}`
    ];
    for (const ep of endpoints) {
      try {
        return await client.delete(ep);
      } catch {
        // ignore
      }
    }
    return null;
  }
};

export default adminApi;

