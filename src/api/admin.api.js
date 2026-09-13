// -------------------------------------------------------------
// Admin API (/api/admin)
// Native fetch implementation
// -------------------------------------------------------------
import { client } from './client';
import { normalizeUser } from './auth.api';

export const adminApi = {
  /**
   * Get store dashboard summary statistics
   */
  async getDashboard() {
    try {
      const res = await client.get('/admin/dashboard');
      return res?.data || res;
    } catch {
      // Fallback stats
      const res = await client.get('/admin/stats');
      return res?.data || res;
    }
  },

  /**
   * Get all registered users (Admin)
   */
  async getUsers() {
    const res = await client.get('/admin/users');
    let rawList = [];
    if (Array.isArray(res)) rawList = res;
    else if (Array.isArray(res?.data)) rawList = res.data;
    else if (Array.isArray(res?.users)) rawList = res.users;

    return rawList.map(normalizeUser).filter(Boolean);
  },

  /**
   * Update user role / status (Admin)
   */
  async updateUser(id, payload) {
    const res = await client.put(`/admin/users/${id}`, payload);
    return res?.data || res;
  }
};

export default adminApi;
