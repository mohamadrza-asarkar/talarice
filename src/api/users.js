import { api } from './client';

export const usersAPI = {
  getAll: (params = {}) => api.get('/admin/users', { params }),
  create: (data) => api.post('/admin/users', data),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/admin/users/${id}`),
  getDashboardStats: () => api.get('/admin/dashboard'),
  resetData: () => api.post('/admin/reset-data', {}),
};

export default usersAPI;
