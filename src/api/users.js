import { api } from './client';

export const usersAPI = {
  // Get all users (Admin)
  getAll: async (params = {}) => {
    return api.get('/admin/users', { params }).catch(() => api.get('/users', { params }));
  },

  // Create new user (Admin)
  create: async (userData) => {
    return api.post('/admin/users', userData).catch(() => api.post('/users', userData));
  },

  // Update user role (Admin: admin or user)
  updateRole: async (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role }).catch(() => {
      return api.put(`/users/${id}`, { role });
    });
  },

  // Delete user (Admin)
  delete: async (id) => {
    return api.delete(`/admin/users/${id}`).catch(() => api.delete(`/users/${id}`));
  },

  // Get Admin Dashboard Stats
  getDashboardStats: async () => {
    return api.get('/admin/dashboard').catch(() => api.get('/admin/stats'));
  },

  // Reset all data (Admin)
  resetData: async () => {
    return api.post('/admin/reset-data', {});
  },

  // Seed sample data (Admin)
  seedData: async () => {
    return api.post('/admin/seed-data', {});
  },
};

export default usersAPI;
