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
   * Update user role / status (Admin)
   */
  async updateUser(id, payload) {
    const endpoints = [
      `/admin/users/${id}`,
      `/users/${id}`
    ];
    let res = null;
    for (const ep of endpoints) {
      try {
        res = await client.put(ep, payload);
        break;
      } catch {
        try {
          res = await client.patch(ep, payload);
          break;
        } catch {
          // ignore
        }
      }
    }
    const raw = unwrapDoc(res?.data || res);
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

